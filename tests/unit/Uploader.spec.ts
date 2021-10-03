import { mount, shallowMount, VueWrapper } from '@vue/test-utils';
import Uploader from '@/components/Uploader.vue';
import axios from 'axios';
import flushPromises from 'flush-promises';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
let wrapper: VueWrapper<any>;
const testFile = new File(['xyz'], 'test.png', { type: 'image/png' });

const mockComponent = {
  template: '<span><svg></svg></span>'
};

const iconComponents = {
  DeleteOutlined: mockComponent,
  LoadingOutlined: mockComponent,
  FileOutlined: mockComponent
};

const setInputValue = (input: HTMLInputElement) => {
  const files = [testFile] as any;
  Object.defineProperty(input, 'files', {
    value: files,
    writable: false
  });
};

describe('Uploader Component', () => {
  beforeAll(() => {
    wrapper = shallowMount(Uploader, {
      props: {
        url: 'https://httpbin.org/post'
      },
      global: {
        // 組件內註冊的組件使用 stubs
        stubs: iconComponents
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

  it('upload process should works find', done => {
    mockedAxios.post.mockResolvedValueOnce({ status: 'success' });
    // 模擬檔案上傳
    // 將 testFile 傳到 input 內
    const fileInput = wrapper.get('input').element as HTMLInputElement;
    setInputValue(fileInput);

    // 觸發 change 事件
    wrapper.get('input').trigger('change');
    wrapper.vm.$nextTick(async () => {
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);

      // button disabled
      expect(wrapper.get('button').attributes()).toHaveProperty('disabled');
      expect(wrapper.findAll('.uploader__item').length).toBe(1);
      const firstItem = wrapper.get('.uploader__item:first-child');

      // 是否有正確添加 uploading class
      expect(firstItem.classes()).toContain('uploader__item--loading');

      await flushPromises();
      expect(wrapper.get('button').text()).toBe('上傳');
      expect(firstItem.classes()).toContain('uploader__item--success');
      expect(firstItem.get('.uploader__filename').text()).toBe(testFile.name);
      done();
    });
  });

  it('should return error text whene post is rejected', done => {
    mockedAxios.post.mockRejectedValueOnce({ error: 'error' });
    wrapper.get('input').trigger('change');
    wrapper.vm.$nextTick(async () => {
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);

      await flushPromises();
      expect(wrapper.get('button').text()).toBe('上傳');
      expect(wrapper.findAll('.uploader__item').length).toBe(2);
      const lastItem = wrapper.get('.uploader__item:last-child');
      expect(lastItem.classes()).toContain('uploader__item--error');
      await lastItem.get('.uploader__delete').trigger('click');
      expect(wrapper.findAll('.uploader__item').length).toBe(1);
      done();
    });
  });

  it('should show the correct interface when using custom slot', done => {
    mockedAxios.post.mockResolvedValueOnce({ data: { url: 'dummy.url' } });
    mockedAxios.post.mockResolvedValueOnce({ data: { url: 'xyz.url' } });

    const wrapper = mount(Uploader, {
      props: {
        url: 'test.url'
      },
      global: {
        stubs: iconComponents
      },
      slots: {
        default: '<button>Custom buttom</button>',
        loading: '<div class="loading">custom loading</div>',
        uploaded: `<template #uploaded="{ uploadedData }">
          <div class="custom-loaded">{{ uploadedData.url }}</div>
        </template>
        `
      }
    });

    expect(wrapper.get('button').text()).toBe('Custom buttom');
    const fileInput = wrapper.get('input').element as HTMLInputElement;
    setInputValue(fileInput);
    wrapper.get('input').trigger('change');
    wrapper.vm.$nextTick(async () => {
      expect(wrapper.get('.loading').text()).toBe('custom loading');
      await flushPromises();
      expect(wrapper.get('.custom-loaded').text()).toBe('dummy.url');
      done();
    });
  });
});
