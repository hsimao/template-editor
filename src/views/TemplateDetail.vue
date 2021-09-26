<template>
  <div class="template-dtail">
    <a-row v-if="template" type="flex" justify="center">
      <a-col span="8" class="template-dtail__img">
        <img :src="template.coverImg" :alt="template.title" />
      </a-col>
      <a-col span="8">
        <h2>{{ template.title }}</h2>
        <p>{{ template.title }}</p>
        <div class="template-dtail__author">
          <a-avatar>V</a-avatar>
          該模板由
          <b>{{ template.author }}</b>
          創作
        </div>
        <div class="template-dtail__bar-code-area">
          <span>掃一掃, 手機預覽</span>
          <div ref="container"></div>
        </div>
        <div class="template-dtail__use-button">
          <router-link to="/editor">
            <a-button type="primary" size="large">Editor</a-button>
          </router-link>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { GlobalDataProps } from '../store';
import { TemplateProps } from '../store/templates';
export default defineComponent({
  setup() {
    const route = useRoute();
    const store = useStore<GlobalDataProps>();
    const currentId = route.params.id as string;
    const template = computed<TemplateProps>(() =>
      store.getters.getTemplateById(parseInt(currentId))
    );

    return {
      route,
      template
    };
  }
});
</script>

<style scoped></style>
