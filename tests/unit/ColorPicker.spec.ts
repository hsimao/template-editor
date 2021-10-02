import { mount, VueWrapper } from '@vue/test-utils';
import ColorPicker from '@/components/ColorPicker.vue';
import rgbHex from 'rgb-hex';

const defaultColors = [
  '#ffffff',
  '#f5222d',
  '#fa541c',
  '#fadb14',
  '#52c41a',
  '#1890ff',
  '#722ed1',
  '#9c9c9c',
  '#000000',
  ''
];
let wrapper: VueWrapper<any>;

describe('ColorPicker Component', () => {
  beforeAll(() => {
    wrapper = mount(ColorPicker, {
      props: {
        value: '#ffffff',
        colors: defaultColors
      }
    });
  });

  it('should render the correct interface', () => {
    // 測試左側是否為 input, 類型和值是否正確
    expect(wrapper.find('input').exists()).toBeTruthy();
    const input = wrapper.get('input').element;
    expect(input.type).toBe('color');
    expect(input.value).toBe('#ffffff');

    // 測試右側是否有顏色列表
    expect(wrapper.findAll('.color-picker__item').length).toBe(
      defaultColors.length
    );

    // 檢查一個元素的 css backgroundColor 屬性是否相等對應的顏色
    const firstItem = wrapper.get('.color-picker__item:first-child div')
      .element as HTMLElement;
    expect(`#${rgbHex(firstItem.style.backgroundColor)}`).toBe(
      defaultColors[0]
    );

    // 測試最後一個元素是否有特殊的 class 名稱(透明)
    const lastItem = wrapper.get('.color-picker__item:last-child div')
      .element as HTMLElement;
    expect(
      lastItem.classList.contains('color-picker__item-bg--transparent')
    ).toBeTruthy();
  });

  it('should send the correct event when change input', async () => {
    const blackHex = '#000000';
    const input = wrapper.get('input');
    await input.setValue(blackHex);
    expect(wrapper.emitted()).toHaveProperty('change');
    const events = wrapper.emitted('change');
    if (events) {
      expect(events[0]).toEqual([blackHex]);
    }
  });

  it('should send the correct event when clicking the color list', async () => {
    const firstItem = wrapper.get('.color-picker__item:first-child div');
    firstItem.trigger('click');
    const events = wrapper.emitted('change');
    if (events) {
      expect(events[1]).toEqual([defaultColors[0]]);
    }
  });
});
