import { Module } from 'vuex';
import { GlobalDataProps } from './index';

export interface TemplateProps {
  id: number;
  title: string;
  coverImg: string;
  author: string;
  copiedCount: number;
}

const testData: TemplateProps[] = [
  {
    id: 1,
    title: 'title1',
    coverImg: 'https://picsum.photos/200/300/?random',
    author: 'Mars',
    copiedCount: 3
  },
  {
    id: 2,
    title: 'title2',
    coverImg: 'https://picsum.photos/210/300/?random',
    author: 'Jack',
    copiedCount: 30
  },
  {
    id: 3,
    title: 'title3',
    coverImg: 'https://picsum.photos/210/310/?random',
    author: 'Milk',
    copiedCount: 4
  },
  {
    id: 4,
    title: 'title4',
    coverImg: 'https://picsum.photos/210/320/?random',
    author: 'Sally',
    copiedCount: 10
  }
];

export interface TemplatesProps {
  data: TemplateProps[];
}

const tempaltes: Module<TemplatesProps, GlobalDataProps> = {
  state: {
    data: testData
  },
  getters: {
    getTemplateById: state => (id: number) =>
      state.data.find(template => template.id === id) || null
  }
};

export default tempaltes;
