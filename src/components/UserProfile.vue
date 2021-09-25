<template>
  <a-button
    v-if="!user.isLogin"
    type="primary"
    class="user-profile"
    @click="login"
  >
    登入
  </a-button>
  <div v-else>
    <a-dropdown-button class="user-profile">
      <router-link to="/setting">{{ user.userName }}</router-link>
      <template v-slot:overlay>
        <a-menu class="user-profile-dropdown">
          <a-menu-item key="0" @click="logout">登出</a-menu-item>
        </a-menu>
      </template>
    </a-dropdown-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { UserProps } from '../store';

export default defineComponent({
  name: 'UserProfile',
  props: {
    user: {
      type: Object as PropType<UserProps>,
      required: true
    }
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const login = () => {
      store.commit('login');
      message.success('登入成功', 2);
    };

    const logout = () => {
      store.commit('logout');
      message.success('登出成功, 2秒後回到首頁');
      setTimeout(() => {
        router.push('/');
      }, 2000);
    };

    return {
      login,
      logout
    };
  }
});
</script>

<style scoped></style>
