import { Module } from 'vuex';
import { GlobalDataProps } from './index';
import { v4 as uuidv4 } from 'uuid';
import { TextComponentProps } from '../defaultProps';

export interface EditorProps {
  // 提供中間編輯器渲染的組件
  components: ComponentData[];
  // 當前所選的編輯組件, uuid
  currentElement: string;
}

export interface ComponentData {
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
    props: {
      actionType: 'url',
      url: 'https://www.facebook.com/',
      text: 'hello',
      fontSize: '20px',
      color: 'green'
    }
  },
  {
    id: uuidv4(),
    name: 'e-text',
    props: { text: 'hello2', fontSize: '12px', fontWeight: 'bold' }
  },
  {
    id: uuidv4(),
    name: 'e-text',
    props: { text: 'hello3', fontSize: '16px' }
  }
];

const editor: Module<EditorProps, GlobalDataProps> = {
  state: {
    components: testComponents,
    currentElement: ''
  },
  mutations: {
    addComponent(state, props: Partial<TextComponentProps>) {
      const newComponent: ComponentData = {
        id: uuidv4(),
        name: 'e-text',
        props
      };

      state.components.push(newComponent);
    },
    removeComponent(state, id: string) {
      state.components = state.components.filter(
        component => component.id !== id
      );
    },
    setActive(state, id: string) {
      state.currentElement = id;
    }
  },
  getters: {
    getCurrentElement: state =>
      state.components.find(component => component.id === state.currentElement)
  }
};

export default editor;
