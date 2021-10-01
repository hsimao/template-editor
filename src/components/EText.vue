<template>
  <component :is="tag" :style="styleProps" class="e-text" @click="handleClick">
    {{ text }}
  </component>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useComponentCommon from '@/hooks/useComponentCommon';
import {
  transformComponentProps,
  textDefaultProps,
  textStylePropNames
} from '@/defaultProps';

const defaultProps = transformComponentProps(textDefaultProps);

export default defineComponent({
  name: 'EText',
  props: {
    tag: {
      type: String,
      default: 'div'
    },
    ...defaultProps
  },
  setup(props) {
    const { styleProps, handleClick } = useComponentCommon(
      props,
      textStylePropNames
    );

    return {
      styleProps,
      handleClick
    };
  }
});
</script>

<style scoped>
h2.e-text,
p.e-text {
  margin-bottom: 0;
}

button.e-text {
  padding: 5px 10px;
  cursor: pointer;
}

.e-text {
  box-sizing: border-box;
  white-space: pre-wrap;
  position: relative !important;
}
</style>
