<template>
  <div class="homepage-container">
    <UploaderStyled />
    <Uploader url="https://httpbin.org/post">
      自定義上傳按鈕
      <template #uploaded="{ uploadedData }">
        自定義上傳完後 {{ uploadedData.url }}
      </template>
      <template #loading>
        自定義 loading
      </template>
    </Uploader>
    <Uploader url="https://httpbin.org/post" listType="picture" />
    <a-layout :style="{ background: '#fff' }">
      <a-layout-header class="header">
        <div class="page-title" :style="{ color: '#fff' }">
          <router-link to="/">樂高</router-link>
        </div>
        <UserProfile :user="user" />
      </a-layout-header>

      <a-layout-content class="home-layout">
        <div class="content-container">
          <router-view />
        </div>
      </a-layout-content>

      <a-layout-footer>© 2021 XXX All Rights Reserved XXX </a-layout-footer>
    </a-layout>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import UserProfile from './components/UserProfile.vue';
import Uploader from '@/components/Uploader.vue';
import UploaderStyled from '@/components/UploaderStyled.vue';

export default defineComponent({
  components: {
    UserProfile,
    Uploader,
    UploaderStyled
  },
  name: 'App',
  setup() {
    const store = useStore();
    const user = computed(() => store.state.user);
    return {
      user
    };
  }
});
</script>

<style>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
