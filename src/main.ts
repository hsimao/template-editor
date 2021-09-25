import { createApp } from 'vue';
import router from './routes';
import store from './store';
import App from './App.vue';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

createApp(App)
  .use(store)
  .use(router)
  .use(Antd)
  .mount('#app');
