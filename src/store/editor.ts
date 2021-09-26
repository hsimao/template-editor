import { Module } from 'vuex';
import { GlobalDataProps } from './index';
import { v4 as uuidv4 } from 'uuid';

export interface EditorProps {
  // 提供中間編輯器渲染的組件
  components: ComponentData[];
  // 當前所選的編輯組件, uuid
  currentElement: string;
}

interface ComponentData {
  props: { [key: string]: any };
  // uuid v4 生成
  id: string;
  // 業務組件庫名稱, e-text, e-image 等等
  name: string;
}

export const testComponents: ComponentData[] = [
  {
    id: uuidv4(),
    name: 'e-text',
    props: { text: 'hello' }
  },
  {
    id: uuidv4(),
    name: 'e-text',
    props: { text: 'hello2' }
  },
  {
    id: uuidv4(),
    name: 'e-text',
    props: { text: 'hello3' }
  }
];

const editor: Module<EditorProps, GlobalDataProps> = {
  state: {
    components: testComponents,
    currentElement: ''
  }
};

export default editor;
