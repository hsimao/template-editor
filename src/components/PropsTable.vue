<template>
  <div class="props-table">
    <div
      v-for="(item, index) in formatProps"
      :key="index"
      class="props-table__item"
    >
      <component :is="item.component" :value="item.value" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue';
import { PropsToForms, mapPropsToForms } from '@/propsMap';
import { TextComponentProps } from '@/defaultProps';

export default defineComponent({
  name: 'PropsTable',
  props: {
    props: {
      type: Object as PropType<TextComponentProps>,
      required: true
    }
  },
  setup(props) {
    const formatProps = computed(() => {
      return Object.keys(props.props).reduce((acc, it: string) => {
        const key = it as keyof PropsToForms;
        const item = mapPropsToForms[key];
        if (item) {
          item.value = props.props[key];
          acc[key] = item;
        }
        return acc;
      }, {} as PropsToForms);
    });

    return {
      formatProps
    };
  }
});
</script>

<style scoped></style>
