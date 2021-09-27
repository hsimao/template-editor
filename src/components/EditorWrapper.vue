<template>
  <div class="editor-wrapper">
    <div class="editor-wrapper__close" @click="handleDelete">X</div>
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'EditorWrapper',
  emit: ['on-delete'],
  setup(props, { emit }) {
    const handleDelete = () => emit('on-delete');

    return {
      handleDelete
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
