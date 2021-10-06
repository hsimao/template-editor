import { message } from 'ant-design-vue';

interface CheckCondition {
  format?: string[];
  size?: number; // 大小以 M 為單為
}

type ErrorType = 'size' | 'format' | null;

export function beforeUploadCheck(file: File, condition: CheckCondition) {
  const { format, size } = condition;
  const isValidFormat = format ? format.includes(file.type) : true;
  const isValidSize = size ? file.size / 1024 / 1024 < size : true;

  let error: ErrorType = null;

  if (!isValidFormat) {
    error = 'format';
  }

  if (!isValidSize) {
    error = 'size';
  }

  return {
    passed: isValidFormat && isValidSize,
    error
  };
}

export const commonUploadCheck = (file: File) => {
  const { passed, error } = beforeUploadCheck(file, {
    size: 1,
    format: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  });

  if (error === 'format') {
    message.error('上傳圖片只能是 JPG/PNG/Webp 格式');
  }

  if (error === 'size') {
    message.error('上傳圖片大小不能超過 1 Mb');
  }

  return passed;
};
