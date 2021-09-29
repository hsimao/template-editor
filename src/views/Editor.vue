<template>
  <div class="editor" id="editor-layout-main">
    <a-layout>
      <a-layout-sider width="300" style="background: white">
        <div class="sidebar-container">組件列表</div>
        <ComponentsList
          :list="defaultTextTemplates"
          @onItemClick="handleAddItem"
        />
      </a-layout-sider>

      <a-layout style="padding: 0 24px 24px">
        <a-layout-content class="editor__content preview-container">
          <p>畫布區域</p>
          <div class="editor__preview" id="canvas-area">
            <EditorWrapper
              v-for="component in components"
              :key="component.id"
              :id="component.id"
              :active="currentElement && currentElement.id === component.id"
              @onDelete="handleDeleteItem"
              @setActive="handleActive"
            >
              <component :is="component.name" v-bind="component.props" />
            </EditorWrapper>
          </div>
        </a-layout-content>
      </a-layout>

      <a-layout-sider width="300" style="background: white" class="setting">
        組件屬性
        <PropsTable
          v-if="currentElement"
          :props="currentElement.props"
          @change="handleChange"
        />
        <pre>{{ currentElement && currentElement.props }}</pre>
      </a-layout-sider>
    </a-layout>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import { GlobalDataProps } from '../store';
import { ComponentData } from '../store/editor';
import EText from '@/components/EText.vue';
import ComponentsList from '@/components/ComponentsList.vue';
import EditorWrapper from '@/components/EditorWrapper.vue';
import PropsTable from '@/components/PropsTable.vue';
import defaultTextTemplates from '@/defaultTemplates';
import { TextComponentProps } from '@/defaultProps';

export default defineComponent({
  components: {
    EText,
    ComponentsList,
    EditorWrapper,
    PropsTable
  },
  setup() {
    const store = useStore<GlobalDataProps>();
    console.log(store.getters);

    const components = computed(() => store.state.editor.components);
    const currentElement = computed<ComponentData | null>(
      () => store.getters.getCurrentElement
    );

    const handleAddItem = (props: TextComponentProps) => {
      store.commit('addComponent', props);
    };

    const handleDeleteItem = (id: string) => {
      store.commit('removeComponent', id);
    };

    const handleActive = (id: string) => {
      store.commit('setActive', id);
    };

    const handleChange = (e: any) => {
      store.commit('updateComponent', e);
    };

    return {
      components,
      defaultTextTemplates,
      currentElement,
      handleAddItem,
      handleDeleteItem,
      handleActive,
      handleChange
    };
  }
});
</script>

<style lang="scss" scoped>
.editor {
  max-width: 1380px;
  margin: 0 auto;

  .ant-layout {
    min-height: calc(100vh - 64px - 70px);
  }

  &__preview {
    position: relative;
  }
}
</style>
