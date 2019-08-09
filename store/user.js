import { action, decorate, flow, observable } from 'mobx';
import md5 from 'md5';
import Service from '../services/AdminServices';
import { useStaticRendering } from 'mobx-react';

const isServer = typeof window === 'undefined';
useStaticRendering(isServer);
class User {
  token = '';

  getToken = flow(function*() {
    this.token = yield Service.login({ user_name: 'russell', password: md5('111111') });
  });
}

decorate(User, {
  token: observable,
  getToken: action.bound
});

export default User;
