import { createApp } from 'vue';
import router from './routes';
import store from './store';
import App from './App.vue';
import Antd from 'ant-design-vue';
import Mars from 'mars-component';
import 'ant-design-vue/dist/antd.css';
import 'mars-component/dist/bundle.css';

createApp(App)
  .use(store)
  .use(router)
  .use(Antd)
  .use(Mars)
  .mount('#app');
