<template>
  <TemplateList :list="testData" />
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import { GlobalDataProps } from '../store';
import TemplateList from '../components/TemplateList.vue';

export default defineComponent({
  components: {
    TemplateList
  },
  setup() {
    const store = useStore<GlobalDataProps>();
    const testData = computed(() => store.state.templates);
    return { testData };
  }
});
</script>

<style scoped></style>
