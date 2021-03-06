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
      textAlign: 'left',
      fontFamily: '',
      lineHeight: '1',
      color: '#000000'
    }
  },
  {
    id: uuidv4(),
    name: 'e-text',
    props: {
      text: 'hello2',
      fontSize: '12px',
      textAlign: 'left',
      fontWeight: 'bold',
      fontFamily: '',
      lineHeight: '2',
      color: '#000000'
    }
  },
  {
    id: uuidv4(),
    name: 'e-text',
    props: {
      text: 'hello3',
      fontSize: '16px',
      textAlign: 'left',
      lineHeight: '3',
      fontFamily: ''
    }
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
        // NOTE: 使用解構避免同樣 defaultTextTemplates 屬性參考相同記憶體位置, 導致同步修改到
        props: { ...props }
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
    },
    updateComponent(state, { key, value }) {
      const targetComponent = state.components.find(
        component => component.id === state.currentElement
      );

      if (targetComponent) {
        targetComponent.props[key as keyof TextComponentProps] = value;
      }
    }
  },
  getters: {
    getCurrentElement: state =>
      state.components.find(component => component.id === state.currentElement)
  }
};

export default editor;
