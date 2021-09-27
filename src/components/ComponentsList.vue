<template>
  <div class="components-list">
    <div
      class="components-list__item"
      @click="onItemClick(item)"
      v-for="(item, index) in list"
      :key="index"
    >
      <EText v-bind="item" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import EText from '@/components/EText.vue';

export default defineComponent({
  name: 'ComponentsList',
  components: {
    EText
  },
  props: {
    list: {
      type: Array,
      required: true
    }
  },
  emits: ['on-item-click'],
  setup(props, { emit }) {
    const onItemClick = (data: any) => {
      emit('on-item-click', data);
    };

    return {
      onItemClick
    };
  }
});
</script>

<style scoped></style>
