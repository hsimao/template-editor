<template>
  <div class="editor-wrapper" :class="{ active }" @click="handleClick">
    <div class="editor-wrapper__close" @click="handleDelete">X</div>
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'EditorWrapper',
  emit: ['on-delete', 'set-active'],
  props: {
    id: {
      type: String,
      required: true
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const handleDelete = () => emit('on-delete', props.id);
    const handleClick = () => emit('set-active', props.id);

    return {
      handleDelete,
      handleClick
    };
  }
});
</script>

<style lang="scss" scoped>
.editor-wrapper {
  position: relative;
  display: flex;
  padding: 16px;
  border: dashed 1px gray;

  &.active {
    border: solid 1px #1890ff;
  }

  &__close {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border: solid 1px red;
    border-radius: 50%;
    color: red;
    transform: translate(50%, -50%);
  }
}
</style>
