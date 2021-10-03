import { shallowMount, VueWrapper } from '@vue/test-utils';
import Uploader from '@/components/Uploader.vue';
import axios from 'axios';
import flushPromises from 'flush-promises';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
let wrapper: VueWrapper<any>;
const testFile = new File(['xyz'], 'test.png', { type: 'image/png' });

describe('Uploader Component', () => {
  beforeAll(() => {
    wrapper = shallowMount(Uploader, {
      props: {
        url: 'https://httpbin.org/post'
      }
    });
  });

  afterEach(() => {
    mockedAxios.post.mockReset();
  });

  it('basic layout before uploading', () => {
    expect(wrapper.find('button').exists()).toBeTruthy();
    expect(wrapper.get('button').text()).toBe('上傳');
    expect(wrapper.get('.uploader__input').isVisible()).toBeFalsy();
  });

  it('upload process should works find', async () => {
    mockedAxios.post.mockResolvedValueOnce({ status: 'success' });
    // 模擬檔案上傳
    // 將 testFile 傳到 input 內
    const fileInput = wrapper.get('input').element as HTMLInputElement;
    const files = [testFile] as any;
    Object.defineProperty(fileInput, 'files', {
      value: files,
      writable: false
    });

    // 觸發 change 事件
    wrapper.get('input').trigger('change');
    wrapper.vm.$nextTick(async () => {
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
      expect(wrapper.get('button').text()).toBe('上傳中...');
      await flushPromises();
      expect(wrapper.get('button').text()).toBe('上傳成功');
    });
  });

  it('should return error text whene post is rejected', async () => {
    mockedAxios.post.mockRejectedValueOnce({ error: 'error' });
    wrapper.get('input').trigger('change');
    wrapper.vm.$nextTick(async () => {
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
      expect(wrapper.get('button').text()).toBe('上傳中...');
      await flushPromises();
      expect(wrapper.get('button').text()).toBe('上傳失敗');
    });
  });
});
