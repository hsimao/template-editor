import { TextComponentProps } from './defaultProps';

export interface PropToForm {
  component: string;
  subComponent?: string;
  value?: string;
  extraProps?: { [key: string]: any };
  description?: string;
  // 提供 subComponent 渲染的資料
  options?: { text: string; value: any }[];
  // 轉換傳遞給組件內的 value
  initalTransform?: (v: any) => any;
  // 自定義傳遞到組件的 value key
  valueProp?: string;
}

export type PropsToForms = {
  [P in keyof TextComponentProps]?: PropToForm;
};

// 樣式屬性映射到編輯組件的 map 表
export const mapPropsToForms: PropsToForms = {
  text: {
    description: '內文',
    component: 'a-textarea',
    extraProps: { rows: 3 }
  },
  fontSize: {
    description: '文字大小',
    component: 'a-input-number',
    initalTransform: (value: string) => parseInt(value)
  },
  lineHeight: {
    description: '文字行高',
    component: 'a-slider',
    extraProps: { min: 0, max: 3, step: 0.1 },
    initalTransform: (value: string) => parseFloat(value)
  },
  textAlign: {
    description: '對齊方向',
    component: 'a-radio-group',
    subComponent: 'a-radio-button',
    options: [
      { text: '左', value: 'left' },
      { text: '中', value: 'center' },
      { text: '右', value: 'right' }
    ]
  },
  fontFamily: {
    description: '字體',
    component: 'a-select',
    subComponent: 'a-select-option',
    options: [
      { text: '無', value: '' },
      { text: '宋體', value: '"SimSun","STSong"' },
      { text: '黑體', value: '"SimHei","STHeiti"' },
      { text: '楷體', value: '"KaiTi","STKaiti"' },
      { text: '仿宋', value: '"FangSong","STFangsong"' }
    ]
  }
};
