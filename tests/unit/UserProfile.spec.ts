import { mount, VueWrapper } from '@vue/test-utils';
import { message } from 'ant-design-vue';
import store from '@/store/index';
import UserProfile from '@/components/UserProfile.vue';
let wrapper: VueWrapper<any>;

jest.mock('ant-design-vue', () => ({
  message: {
    success: jest.fn()
  }
}));
jest.mock('vue-router');

const mockComponent = {
  template: '<div><slot></slot></div>'
};

const mockComponent2 = {
  template: '<div><slot></slot><slot name="overlay"></slot></div>'
};

const globalComponents = {
  'a-button': mockComponent,
  'a-dropdown-button': mockComponent2,
  'router-link': mockComponent,
  'a-menu': mockComponent,
  'a-menu-item': mockComponent
};

describe('UserProfile component', () => {
  beforeAll(() => {
    wrapper = mount(UserProfile, {
      props: {
        user: { isLogin: false }
      },
      global: {
        components: globalComponents,
        provide: {
          store
        }
      }
    });
  });

  it('sholud render login button when login is false', async () => {
    expect(wrapper.get('div').text()).toBe('登入');
    await wrapper.get('div').trigger('click');
    expect(message.success).toHaveBeenCalled();
    expect(store.state.user.userName).toBe('Mars');
  });

  it('sholud render username when login is true', async () => {
    await wrapper.setProps({
      user: { isLogin: true, userName: 'Mars' }
    });
    expect(wrapper.get('.user-profile').html()).toContain('Mars');
    expect(wrapper.find('.user-profile-dropdown').exists()).toBeTruthy();
  });
});
