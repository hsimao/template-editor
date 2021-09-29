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
        v-on="item.events"
      >
        <template v-if="item.subComponent && item.options">
          <component
            v-for="(subData, index) in item.options"
            :key="index"
            :is="item.subComponent"
            :value="subData.value"
          >
            {{ subData.text }}
          </component>
        </template>
      </component>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue';
import { PropsToForms, mapPropsToForms } from '@/propsMap';
import { TextComponentProps } from '@/defaultProps';

interface RenderProps {
  component: string;
  subComponent?: string;
  value: string;
  extraProps?: { [key: string]: any };
  text?: string;
  options?: { text: string; value: any }[];
  valueProp: string;
  eventName: string;
  events: { [key: string]: (e: any) => void };
}

export default defineComponent({
  name: 'PropsTable',
  props: {
    props: {
      type: Object as PropType<TextComponentProps>,
      required: true
    }
  },
  emits: ['change'],
  setup(props, { emit }) {
    // 將 PropToForm 轉換成渲染成組件的參數格式
    const formatProps = computed(() => {
      return Object.keys(props.props).reduce((acc, it: string) => {
        const key = it as keyof PropsToForms;
        const item = mapPropsToForms[key];

        if (item) {
          const {
            valueProp = 'value',
            eventName = 'change',
            inputTransform,
            outputTransform
          } = item;

          const value = inputTransform
            ? inputTransform(props.props[key])
            : props.props[key];

          const renderData: RenderProps = {
            ...item,
            value,
            valueProp,
            eventName,
            events: {
              [eventName]: (e: any) =>
                emit('change', {
                  key,
                  value: outputTransform ? outputTransform(e) : e
                })
            }
          };

          acc[key] = renderData;
        }
        return acc;
      }, {} as { [key: string]: RenderProps });
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
