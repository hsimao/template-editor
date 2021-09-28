<template>
  <div class="props-table">
    <div
      v-for="(item, index) in formatProps"
      :key="index"
      class="props-table__item"
    >
      <span class="props-table__label">{{ item.description }}</span>
      <component
        class="props-table__component"
        :is="item.component"
        :value="item.value"
        v-bind="item.extraProps"
      />
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

<style lang="scss" scoped>
.props-table {
  padding: 0 8px;

  &__item {
    display: flex;
    align-items: center;

    & + & {
      margin-top: 10px;
    }
  }

  &__label {
    flex: 0 0 auto;
    width: 20%;
  }

  &__component {
    width: 80%;
    margin-left: 8px;
  }
}
</style>
