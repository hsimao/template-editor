import { VNode } from 'vue';
import { TextComponentProps } from './defaultProps';

export interface PropToForm {
  component: string;
  subComponent?: string;
  extraProps?: { [key: string]: any };
  text?: string;
  // 提供 subComponent 渲染的資料
  options?: { text: string | VNode; value: any }[];
  // 轉換傳遞給組件內的 value
  inputTransform?: (v: any) => any;
  outputTransform?: (v: any) => any;
  valueProp?: string;
  eventName?: string;
}

export type PropsToForms = {
  [P in keyof TextComponentProps]?: PropToForm;
};

const fontFamilyArr = [
  { text: '宋體', value: '"SimSun","STSong"' },
  { text: '黑體', value: '"SimHei","STHeiti"' },
  { text: '楷體', value: '"KaiTi","STKaiti"' },
  { text: '仿宋', value: '"FangSong","STFangsong"' }
];

const fontFamilyOptions = fontFamilyArr.map(font => ({
  value: font.value,
  text: (<span style={{ fontFamily: font.value }}>{font.text}</span>) as VNode
}));

// 樣式屬性映射到編輯組件的 map 表
export const mapPropsToForms: PropsToForms = {
  text: {
    text: '內文',
    component: 'a-textarea',
    extraProps: { rows: 3 },
    outputTransform: (e: any) => e.target.value
  },
  fontSize: {
    text: '文字大小',
    component: 'a-input-number',
    inputTransform: (value: string) => parseInt(value),
    outputTransform: (value: number) => (value ? `${value}px` : '')
  },
  lineHeight: {
    text: '文字行高',
    component: 'a-slider',
    extraProps: { min: 0, max: 3, step: 0.1 },
    inputTransform: (value: string) => parseFloat(value),
    outputTransform: (value: number) => value.toString()
  },
  textAlign: {
    text: '對齊方向',
    component: 'a-radio-group',
    subComponent: 'a-radio-button',
    options: [
      { text: '左', value: 'left' },
      { text: '中', value: 'center' },
      { text: '右', value: 'right' }
    ],
    outputTransform: (e: any) => e.target.value
  },
  fontFamily: {
    text: '字體',
    component: 'a-select',
    subComponent: 'a-select-option',
    options: [{ text: '無', value: '' }, ...fontFamilyOptions]
  }
};
