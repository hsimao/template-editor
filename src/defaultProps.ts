import { mapValues, without } from 'lodash-es';

export const commonDefaultProps = {
  actionType: '',
  url: '',
  // size
  height: '',
  width: '318px',
  paddingLeft: '0px',
  paddingRight: '0px',
  paddingTop: '0px',
  paddingBottom: '0px',
  // border
  borderStyle: 'none',
  borderColor: '#000',
  borderWidth: '0',
  borderRaduis: '0',
  // shadow and opacity
  boxShadow: '0 0 0 #000000',
  opacity: 1,
  // position and x, y
  position: 'absolute',
  left: '0',
  right: '0',
  top: '0'
};

export const textDefaultProps = {
  // basic props - font styles
  text: '內容',
  fontSize: '14px',
  fontFamily: '',
  fontWeight: 'normal',
  fontStyle: 'normal',
  textDecoration: 'none',
  lineHeight: '1',
  textAlign: 'left',
  color: '#000000',
  backgroundColor: '',
  ...commonDefaultProps
};

// 取得所有樣式的屬性名稱, 使用 without 排除特定屬性
export const textStylePropNames = without(
  Object.keys(textDefaultProps),
  'actionType',
  'url',
  'text'
);

export const transformComponentProps = <T extends { [key: string]: any }>(
  props: T
) => {
  return mapValues(props, item => {
    return {
      type: item.constructor,
      default: item
    };
  });
};
