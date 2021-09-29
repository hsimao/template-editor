import { mapValues, without } from 'lodash-es';

export interface CommonComponentProps {
  // actions
  actionType: string;
  url: string;
  // size
  height: string;
  width: string;
  paddingLeft: string;
  paddingRight: string;
  paddingTop: string;
  paddingBottom: string;
  // border
  borderStyle: string;
  borderColor: string;
  borderWidth: string;
  borderRaduis: string;
  // shadow and opacity
  boxShadow: string;
  opacity: string;
  // position and x, y
  position: string;
  left: string;
  right: string;
  top: string;
}

export interface TextComponentProps extends CommonComponentProps {
  text: string;
  fontSize: string;
  fontFamily: string;
  fontWeight: string;
  fontStyle: string;
  textDecoration: string;
  lineHeight: string;
  textAlign: string;
  color: string;
  backgroundColor: string;
}

export const commonDefaultProps: CommonComponentProps = {
  actionType: '',
  url: '',
  // size
  height: '',
  width: '100%',
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
  opacity: '1',
  // position and x, y
  position: 'absolute',
  left: '0',
  right: '0',
  top: '0'
};

export const textDefaultProps: TextComponentProps = {
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

export const transformComponentProps = (props: TextComponentProps) => {
  return mapValues(props, item => {
    return {
      type: item.constructor as StringConstructor,
      default: item
    };
  });
};
