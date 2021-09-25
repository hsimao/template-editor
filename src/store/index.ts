import { createStore } from 'vuex';

export interface UserProps {
  isLogin: boolean;
  userName?: string;
}

export interface TemplateProps {
  id: number;
  title: string;
  coverImg: string;
  author: string;
  copiedCount: number;
}

export interface GlobalDataProps {
  user: UserProps;
  templates: TemplateProps[];
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

const store = createStore<GlobalDataProps>({
  state: {
    templates: testData,
    user: { isLogin: false }
  },
  mutations: {
    login(state) {
      state.user = { ...state.user, isLogin: true, userName: 'Mars' };
    },
    logout(state) {
      state.user = { isLogin: false };
    }
  },
  getters: {
    getTemplateById: state => (id: number) =>
      state.templates.find(template => template.id === id) || null
  }
});

export default store;
