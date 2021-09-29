import { defineComponent, computed, PropType, VNode } from 'vue';
import { PropsToForms, mapPropsToForms } from '@/propsMap';
import { TextComponentProps } from '@/defaultProps';
import { Input, InputNumber, Slider, Radio, Select } from 'ant-design-vue';

const mapToComponent = {
  'a-textarea': Input.TextArea,
  'a-input-number': InputNumber,
  'a-slider': Slider,
  'a-radio-group': Radio.Group,
  'a-radio-button': Radio.Button,
  'a-select': Select,
  'a-select-option': Select.Option
} as any;

interface RenderProps {
  component: string;
  subComponent?: string;
  value: string;
  extraProps?: { [key: string]: any };
  text?: string;
  options?: { text: string | VNode; value: any }[];
  valueProp: string;
  eventName: string;
  events: { [key: string]: (e: any) => void };
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
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

          const formtEventName = `on${capitalizeFirstLetter(eventName)}`;

          const renderData: RenderProps = {
            ...item,
            value,
            valueProp,
            eventName,
            events: {
              [formtEventName]: (e: any) =>
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

    return () => (
      <div class="props-table">
        {Object.keys(formatProps.value).map(key => {
          const value = formatProps.value[key];
          const PrimaryComponent = mapToComponent[value.component];
          const SubComponent = value.subComponent
            ? mapToComponent[value.subComponent]
            : null;
          const props = {
            [value.valueProp]: value.value,
            ...value.extraProps,
            ...value.events
          };

          return (
            <div key={key} class="props-table__item">
              {value.text && (
                <span class="props-table__label">{value.text}</span>
              )}
              <div class="props-table__component">
                <PrimaryComponent {...props}>
                  {value.options &&
                    value.options.map(option => (
                      <SubComponent value={option.value}>
                        {option.text}
                      </SubComponent>
                    ))}
                </PrimaryComponent>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
});
