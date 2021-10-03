<template>
  <div class="uploader">
    <div class="uploader__upload-area" @click="triggerUpload">
      <slot v-if="isUploading" name="loading">
        <button class="uploader__button" disabled>
          <LoadingOutlined v-if="isUploading" />
        </button>
      </slot>

      <slot
        v-else-if="lastFileData && lastFileData.loaded"
        name="uploaded"
        :uploadedData="lastFileData.data"
      >
        <button class="uploader__button">上傳</button>
      </slot>
      <slot v-else name="default">
        <button class="uploader__button">上傳</button>
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
import { computed, defineComponent, ref, reactive } from 'vue';
import {
  DeleteOutlined,
  LoadingOutlined,
  FileOutlined
} from '@ant-design/icons-vue';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

type UploadStatus = 'ready' | 'loading' | 'success' | 'error';
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
    FileOutlined
  },
  props: {
    url: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const fileInput = ref<null | HTMLInputElement>(null);
    const fileStatus = ref<UploadStatus>('ready');
    const uploadedFiles = ref<UploadFile[]>([]);

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

    const isUploading = computed(() =>
      uploadedFiles.value.some(file => file.status === 'loading')
    );

    const triggerUpload = () => {
      if (fileInput.value) {
        fileInput.value.click();
      }
    };

    const handleFileChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const files = target.files;
      if (files) {
        const uploadedFile = files[0];
        const formData = new FormData();

        const fileObj = reactive<UploadFile>({
          uid: uuidv4(),
          size: uploadedFile.size,
          name: uploadedFile.name,
          status: 'loading',
          raw: uploadedFile
        });
        uploadedFiles.value.push(fileObj);

        formData.append(uploadedFile.name, uploadedFile);

        fileStatus.value = 'loading';
        axios
          .post(props.url, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then(res => {
            console.log(res.data);
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
      }
    };

    const handleRemoveFile = (id: string) => {
      uploadedFiles.value = uploadedFiles.value.filter(file => file.uid !== id);
    };

    return {
      uploadedFiles,
      lastFileData,
      isUploading,
      fileInput,
      triggerUpload,
      handleFileChange,
      handleRemoveFile
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

  &__button {
    padding: 3px;
    max-width: 100px;
    width: 100%;
    border: none;
    border-radius: 3px;
    background-color: #3f9eff;
    color: white;
    cursor: pointer;
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
