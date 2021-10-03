<template>
  <div class="uploader">
    <button @click="triggerUpload">
      {{ buttonText }}
    </button>
    <input
      v-show="false"
      ref="fileInput"
      class="uploader__input"
      type="file"
      @change="handleFileChange"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import axios from 'axios';
type UploadStatus = 'ready' | 'loading' | 'success' | 'error';

export default defineComponent({
  name: 'Uploader',
  props: {
    url: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const fileInput = ref<null | HTMLInputElement>(null);
    const fileStatus = ref<UploadStatus>('ready');

    const buttonText = computed(() => {
      switch (fileStatus.value) {
        case 'loading':
          return '上傳中...';
        case 'success':
          return '上傳成功';
        case 'error':
          return '上傳失敗';
        default:
          return '上傳';
      }
    });

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
          })
          .catch(() => {
            fileStatus.value = 'error';
          });
      }
    };

    return {
      buttonText,
      fileInput,
      triggerUpload,
      handleFileChange
    };
  }
});
</script>

<style lang="scss" scoped>
.uploader {
}
</style>
