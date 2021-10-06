<template>
  <div class="uploader">
    <div class="uploader__upload-area" :class="uploadAreaClass" v-on="events">
      <slot v-if="isUploading" name="loading">
        <button class="uploader__submit" disabled>
          <LoadingOutlined v-if="isUploading" />
        </button>
      </slot>

      <slot v-else name="default">
        <div class="uploader__btns">
          <button class="uploader__file" @click.stop="triggerUpload">
            <UploadOutlined />
            <span>選擇檔案</span>
          </button>

          <button
            v-if="showUploadBtn"
            class="uploader__submit"
            @click.stop="uploadFiles"
          >
            上傳
          </button>
        </div>
      </slot>

      <!-- 圖片準備完後的樣式 -->
      <slot
        v-if="showReadyPreview"
        name="uploaded"
        :uploadedData="lastFileData"
      >
      </slot>
    </div>

    <input
      v-show="false"
      ref="fileInput"
      class="uploader__input"
      type="file"
      @change="handleFileChange"
    />
    <ul v-if="showUploadList" class="uploader__items">
      <li
        v-for="file in filesList"
        :key="file.uid"
        :class="`uploader__item uploader__item--${file.status}`"
      >
        <img
          v-if="file.showPreview"
          class="uploader__preview"
          :src="file.url"
          :alt="file.name"
        />
        <FileOutlined />
        <span class="uploader__filename">{{ file.name }}</span>

        <DeleteOutlined
          class="uploader__delete"
          @click="handleRemoveFile(file.uid)"
        />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, reactive, PropType } from 'vue';
import {
  DeleteOutlined,
  LoadingOutlined,
  FileOutlined,
  UploadOutlined
} from '@ant-design/icons-vue';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

type UploadStatus = 'ready' | 'loading' | 'success' | 'error';
type CheckUpload = (file: File) => boolean | Promise<File>;
type FileListType = 'picture' | 'text';
export interface UploadFile {
  uid: string;
  size: number;
  name: string;
  status: UploadStatus;
  raw: File;
  res?: any;
  url?: string;
  showPreview?: boolean;
}

export default defineComponent({
  name: 'Uploader',
  components: {
    DeleteOutlined,
    LoadingOutlined,
    FileOutlined,
    UploadOutlined
  },
  props: {
    url: {
      type: String,
      required: true
    },
    beforeUpload: {
      type: Function as PropType<CheckUpload>
    },
    drag: {
      type: Boolean,
      default: false
    },
    autoUpload: {
      type: Boolean,
      default: true
    },
    listType: {
      type: String as PropType<FileListType>,
      default: 'text'
    },
    showUploadList: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const fileInput = ref<null | HTMLInputElement>(null);
    const filesList = ref<UploadFile[]>([]);
    const isDragOver = ref(false);

    const uploadAreaClass = computed(() => {
      if (!props.drag) return '';

      let classList = 'uploader__upload-area--drag';
      if (isDragOver.value) {
        classList += ' is-dragover';
      }

      return classList;
    });

    const lastFileData = computed(() => {
      const lastFile = filesList.value[filesList.value.length - 1];
      if (lastFile) {
        return {
          ready: lastFile.status === 'ready',
          loaded: lastFile.status === 'success',
          data: lastFile.res
        };
      }
      return false;
    });

    const showUploadBtn = computed(() => {
      return (
        !props.autoUpload && lastFileData.value && lastFileData.value.ready
      );
    });

    const showReadyPreview = computed(() => {
      if (lastFileData.value) {
        if (props.autoUpload) {
          return lastFileData.value.loaded;
        } else {
          return lastFileData.value.ready;
        }
      }
      return false;
    });

    const isUploading = computed(() =>
      filesList.value.some(file => file.status === 'loading')
    );

    const triggerUpload = () => {
      if (fileInput.value) {
        fileInput.value.click();
      }
    };

    const getFilePreviewBase64 = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        if (/\.(jpe?g|png|gif|webp)$/i.test(file.name)) {
          try {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.addEventListener('load', () =>
              resolve(reader.result as string)
            );
          } catch (err) {
            reject(err);
          }
        } else {
          reject();
        }
      });
    };

    const postFile = (readyFile: UploadFile) => {
      const formData = new FormData();
      formData.append(readyFile.name, readyFile.raw);

      readyFile.status = 'loading';
      axios
        .post(props.url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(res => {
          console.log(res.data);
          readyFile.status = 'success';
          readyFile.res = res.data;
        })
        .catch(() => {
          readyFile.status = 'error';
        })
        .finally(() => {
          // NOTE: reset input, 避免上傳兩張相同圖片, 不會觸發 change 問題
          if (fileInput.value) {
            fileInput.value.value = '';
          }
        });
    };

    const addFileToList = async (file: File) => {
      const fileObj = reactive<UploadFile>({
        uid: uuidv4(),
        size: file.size,
        name: file.name,
        status: 'ready',
        raw: file
      });

      if (props.listType === 'picture') {
        try {
          const base64 = await getFilePreviewBase64(file);
          if (base64) {
            fileObj.url = base64;
            fileObj.showPreview = true;
          }
        } catch (err) {
          console.log('upload file error', err);
        }
      }

      filesList.value.push(fileObj);

      if (props.autoUpload) {
        postFile(fileObj);
      }
    };

    const beforeUploadChcek = (files: null | FileList) => {
      if (files) {
        if (!props.beforeUpload) {
          return addFileToList(files[0]);
        }

        const result = props.beforeUpload(files[0]);
        if (result === true) {
          return addFileToList(files[0]);
        }

        if (result && result instanceof Promise) {
          return result
            .then(processedFile => {
              if (!(processedFile instanceof File)) {
                throw new Error(
                  'beforeUpload Promise should return File object'
                );
              }
              addFileToList(processedFile);
            })
            .catch(err => console.log(err));
        }
      }
    };

    const uploadFiles = () => {
      filesList.value
        .filter(file => file.status === 'ready')
        .forEach(readyFile => postFile(readyFile));
    };

    const handleDrag = (e: DragEvent, over: boolean) => {
      e.preventDefault();
      isDragOver.value = over;
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      isDragOver.value = false;
      if (e.dataTransfer) {
        beforeUploadChcek(e.dataTransfer.files);
      }
    };

    const handleFileChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      beforeUploadChcek(target.files);
    };

    const handleRemoveFile = (id: string) => {
      filesList.value = filesList.value.filter(file => file.uid !== id);
    };

    let events: { [key: string]: (e: any) => void } = {
      click: triggerUpload
    };

    if (props.drag) {
      events = {
        ...events,
        dragover: (e: DragEvent) => {
          handleDrag(e, true);
        },
        dragleave: (e: DragEvent) => {
          handleDrag(e, false);
        },
        drop: handleDrop
      };
    }

    return {
      filesList,
      lastFileData,
      isUploading,
      showUploadBtn,
      showReadyPreview,
      uploadAreaClass,
      fileInput,
      handleFileChange,
      triggerUpload,
      handleRemoveFile,
      uploadFiles,
      events
    };
  }
});
</script>

<style lang="scss" scoped>
.uploader {
  display: flex;
  align-self: center;
  flex-flow: column nowrap;
  justify-content: center;
  padding: 16px;

  &__upload-area {
    &--drag {
      background-color: white;
      border: 1px dashed #ccc;
      border-radius: 4px;
      padding: 20px;
      width: 360px;
      height: 180px;
      text-align: center;
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;
      align-items: center;

      &:hover {
        border: 1px dashed #3f9eff;
      }

      &.is-dragover {
        border: 2px dashed #3f9eff;
        background-color: rgba(#3f9eff, 0.2);
      }
    }
  }

  &__preview {
    width: 100%;
    height: 100%;
    margin-top: 6px;
    object-fit: contain;
  }

  &__btns {
    display: flex;

    > button + button {
      margin-left: 4px;
    }
  }

  &__submit,
  &__file {
    padding: 3px;
    max-width: 100px;
    width: 100%;
    border: none;
    border-radius: 3px;
    background-color: #3f9eff;
    color: white;
    cursor: pointer;

    span {
      margin-left: 4px;
    }
  }

  &__items {
    margin: 6px 0 0 0;
    padding: 0;
    list-style: none;
  }

  &__filename {
    margin-left: 6px;
  }

  &__item {
    display: flex;
    align-items: center;

    & + & {
      margin-top: 6px;
    }

    &--loading {
      color: gray;
    }

    &--success {
      color: #3f9eff;
    }

    &--error {
      color: #f56c6b;
    }
  }

  &__preview {
    width: 75px;
    object-fit: contain;
    margin-right: 8px;
  }

  &__delete {
    margin-left: auto;
    cursor: pointer;
  }
}
</style>
