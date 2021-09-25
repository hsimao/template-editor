<template>
  <div class="editor" id="editor-layout-main">
    <a-layout>
      <a-layout-sider width="300" style="background: yellow">
        <div class="sidebar-container">組件列表</div>
      </a-layout-sider>

      <a-layout style="padding: 0 24px 24px">
        <a-layout-content class="preview-container">
          <p>畫布區域</p>
          <div class="preview-list" id="canvas-area"></div>
        </a-layout-content>
      </a-layout>

      <a-layout-sider width="300" style="background: purple" class="setting">組件屬性</a-layout-sider>
    </a-layout>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  setup() {
    return {};
  }
});
</script>

<style scoped>
.editor {
  border: solid 1px blue;
}
</style>