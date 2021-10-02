<template>
  <div class="color-picker">
    <div class="color-picker__input-container">
      <input
        type="color"
        :value="value"
        @input="onChange($event.target.value)"
      />
      <div class="color-picker__input-bg" :style="displayBgStyle" />
    </div>

    <ul class="color-picker__items">
      <li
        class="color-picker__item"
        v-for="(color, index) in colors"
        :key="index"
        :class="`color-picker__item--${index}`"
        @click.prevent="onChange(color)"
      >
        <div
          v-if="color.startsWith('#')"
          class="color-picker__item-bg"
          :style="{ backgroundColor: color }"
        />
        <div
          v-else
          class="color-picker__item-bg color-picker__item-bg--transparent"
        />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
const defaultColors = [
  '#ffffff',
  '#f5222d',
  '#fa541c',
  '#fadb14',
  '#52c41a',
  '#1890ff',
  '#722ed1',
  '#9c9c9c',
  '#000000',
  ''
];

export default defineComponent({
  name: 'ColorPicker',
  props: {
    value: {
      type: String,
      required: true
    },
    colors: {
      type: Array as PropType<string[]>,
      default: defaultColors
    }
  },
  emits: ['change'],
  setup(props, { emit }) {
    const displayBgStyle = computed(() => {
      if (props.value) {
        return { backgroundColor: props.value };
      }
      return {
        backgroundImage: `url(${require('@/assets/transparent.png')})`
      };
    });

    const onChange = (color: string) => {
      emit('change', color);
    };

    return {
      displayBgStyle,
      onChange
    };
  }
});
</script>

<style lang="scss" scoped>
.color-picker {
  display: flex;
  align-items: center;

  &__input-container {
    position: relative;
    display: flex;
    padding-top: 24%;
    width: 35%;
    height: 0;

    input {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }

  &__input-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: solid 1px rgba(gray, 0.5);
    border-radius: 3px;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    pointer-events: none;
  }

  &__items {
    display: flex;
    flex-flow: row wrap;
    margin: 0 0 0 8px;
    padding: 0;
    width: 65%;
    list-style: none;
  }

  &__item {
    position: relative;
    overflow: hidden;
    flex: 0 0 auto;
    margin: 3px;
    padding-top: calc(20% - 6px);
    width: calc(20% - 6px);
    border: solid 1px rgba(gray, 0.5);
    border-radius: 3px;

    &-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    &-bg--transparent {
      background-image: url('~@/assets/transparent.png');
      background-position: center;
      background-size: 40px 40px;
      background-repeat: no-repeat;
    }
  }
}
</style>
