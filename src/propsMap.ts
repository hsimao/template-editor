import { TextComponentProps } from './defaultProps';

export interface PropToForm {
  component: string;
  value?: string;
  extraProps?: { [key: string]: any };
  description?: string;
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
    component: 'a-input-number'
  },
  lineHeight: {
    description: '文字行高',
    component: 'a-slider',
    extraProps: { min: 0, max: 3, step: 0.1 }
  }
};
