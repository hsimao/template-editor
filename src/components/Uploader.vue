<template>
  <div class="uploader">
    <div class="uploader__upload-area" :class="uploadAreaClass" v-on="events">
      <slot v-if="isUploading" name="loading">
        <button class="uploader__button" disabled>
          <LoadingOutlined v-if="isUploading" />
        </button>
      </slot>

      <!-- 上傳完後樣式 -->
      <slot
        v-else-if="lastFileData && lastFileData.loaded"
        name="uploaded"
        :uploadedData="lastFileData.data"
      >
        <!-- 預覽圖片 -->
        <img
          v-if="showPreviewImg"
          class="uploader__preview"
          :src="previewSrc"
        />
        <button class="uploader__button">上傳</button>
      </slot>

      <slot v-else name="default">
        <button class="uploader__button">
          <UploadOutlined />
          <span>上傳</span>
        </button>
      </slot>
    </div>

    <input
      v-show="false"
      ref="fileInput"
      class="uploader__input"
      type="file"
      @change="handleFileChange"
    />
    <ul class="uploader__items">
      <li
        v-for="file in uploadedFiles"
        :key="file.uid"
        :class="`uploader__item uploader__item--${file.status}`"
      >
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
export interface UploadFile {
  uid: string;
  size: number;
  name: string;
  status: UploadStatus;
  raw: File;
  res?: any;
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
    }
  },
  setup(props) {
    const fileInput = ref<null | HTMLInputElement>(null);
    const fileStatus = ref<UploadStatus>('ready');
    const uploadedFiles = ref<UploadFile[]>([]);
    const isDragOver = ref(false);
    const previewSrc = ref('');

    const uploadAreaClass = computed(() => {
      if (!props.drag) return '';

      let classList = 'uploader__upload-area--drag';
      if (isDragOver.value) {
        classList += ' is-dragover';
      }

      return classList;
    });

    const lastFileData = computed(() => {
      const lastFile = uploadedFiles.value[uploadedFiles.value.length - 1];
      if (lastFile) {
        return {
          loaded: lastFile.status === 'success',
          data: lastFile.res
        };
      }
      return false;
    });

    const showPreviewImg = computed(() => {
      return props.drag && previewSrc.value;
    });

    const isUploading = computed(() =>
      uploadedFiles.value.some(file => file.status === 'loading')
    );

    const triggerUpload = () => {
      if (fileInput.value) {
        fileInput.value.click();
      }
    };

    const handlePreview = (file: File) => {
      if (/\.(jpe?g|png|gif)$/i.test(file.name)) {
        const reader = new FileReader();
        reader.addEventListener(
          'load',
          function() {
            previewSrc.value = this.result as string;
          },
          false
        );
        reader.readAsDataURL(file);
      }
    };

    const postFile = (file: File) => {
      const formData = new FormData();

      const fileObj = reactive<UploadFile>({
        uid: uuidv4(),
        size: file.size,
        name: file.name,
        status: 'loading',
        raw: file
      });
      uploadedFiles.value.push(fileObj);

      formData.append(file.name, file);

      fileStatus.value = 'loading';
      axios
        .post(props.url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(res => {
          console.log(res.data);
          handlePreview(file);
          fileStatus.value = 'success';
          fileObj.status = 'success';
          fileObj.res = res.data;
        })
        .catch(() => {
          fileStatus.value = 'error';
          fileObj.status = 'error';
        })
        .finally(() => {
          // NOTE: reset input, 避免上傳兩張相同圖片, 不會觸發 change 問題
          if (fileInput.value) {
            fileInput.value.value = '';
          }
        });
    };

    const handleBeforeUpload = (file: File) => {
      previewSrc.value = '';

      if (!props.beforeUpload) {
        return postFile(file);
      }

      const result = props.beforeUpload(file);
      if (result === true) {
        return postFile(file);
      }

      if (result && result instanceof Promise) {
        return result
          .then(processedFile => {
            if (!(processedFile instanceof File)) {
              throw new Error('beforeUpload Promise should return File object');
            }
            postFile(processedFile);
          })
          .catch(err => console.log(err));
      }
    };

    const handleDrag = (e: DragEvent, over: boolean) => {
      e.preventDefault();
      isDragOver.value = over;
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      isDragOver.value = false;
      if (e.dataTransfer) {
        handleBeforeUpload(e.dataTransfer.files[0]);
      }
    };

    const handleFileChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files) {
        handleBeforeUpload(target.files[0]);
      }
    };

    const handleRemoveFile = (id: string) => {
      uploadedFiles.value = uploadedFiles.value.filter(file => file.uid !== id);
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
      uploadedFiles,
      lastFileData,
      isUploading,
      previewSrc,
      showPreviewImg,
      uploadAreaClass,
      fileInput,
      handleFileChange,
      handleRemoveFile,
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

      .uploader__button {
        background-color: transparent;
        color: rgba(#000, 0.85);
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        font-size: 16px;
      }
    }
  }

  &__preview {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  &__button {
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

  &__delete {
    margin-left: auto;
    cursor: pointer;
  }
}
</style>
