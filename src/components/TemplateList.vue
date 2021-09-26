<template>
  <div class="template-list-component">
    <a-row :gutter="16">
      <a-col :span="6" v-for="item in list" :key="item.id">
        <router-link :to="`/template/${item.id}`">
          <a-card hoverable>
            <template v-slot:cover>
              <img :src="item.coverImg" />
              <div class="hover-item">
                <a-button size="large" type="primary"></a-button>
              </div>
            </template>

            <a-card-meta :title="item.title">
              <template v-slot:description>
                <div class="description-detail">
                  <span>作者：{{ item.author }}</span>
                  <span class="user-number">{{ item.copiedCount }}</span>
                </div>
              </template>
            </a-card-meta>
          </a-card>
        </router-link>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { TemplateProps } from '../store/templates';

export default defineComponent({
  props: {
    list: {
      type: Array as PropType<TemplateProps[]>,
      required: true
    }
  },
  setup() {
    return {};
  }
});
</script>

<style scoped></style>
