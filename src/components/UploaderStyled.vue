<template>
  <Uploader
    class="uploader-styled"
    url="https://httpbin.org/post"
    :showUploadList="false"
    :beforeUpload="commonUploadCheck"
    @success="
      data => {
        handleUploadSuccess(data.resp);
      }
    "
  >
    <div class="uploader-styled__container">
      <FileImageOutlined class="uploader-styled__icon" />
      <h4>上傳圖片</h4>
    </div>
    <template #loading>
      <div class="uploader-styled__container">
        <LoadingOutlined spin />
        <h4>上傳中</h4>
      </div>
    </template>
  </Uploader>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Uploader from '@/components/Uploader.vue';
import { FileImageOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { commonUploadCheck } from '@/Upload';

export default defineComponent({
  name: 'UploaderStyled',
  components: {
    Uploader,
    FileImageOutlined,
    LoadingOutlined
  },
  emits: ['success'],
  setup(props, { emit }) {
    const handleUploadSuccess = (res: any) => emit('success', res);

    return {
      handleUploadSuccess,
      commonUploadCheck
    };
  }
});
</script>

<style lang="scss" scoped>
.uploader-styled {
  &__container {
    display: flex;
    align-self: center;
    justify-content: center;
    padding: 10px;
    width: 100px;
    border-radius: 5px;
    background: #1890ff;
    color: #ffffff;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);

    &:hover {
      background: #40a9ff;
    }

    h4 {
      margin-bottom: 0;
      margin-left: 10px;
      color: #ffffff;
    }
  }

  &__icon {
    display: flex;
    align-items: center;
  }
}
</style>
