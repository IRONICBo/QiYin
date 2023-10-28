import { defineStore } from 'pinia';
import { store } from './index';

export const tokenStore = defineStore('token',{
  state: () => ({
    token: '',
  }),
  getters: {
    getToken() {
      return this.token;
    },
  },
  actions: {
    setToken(token) {
      this.token = token;
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        storage: localStorage,
        paths: ['token'],
      },
    ],
  },
});

export const accountStore = defineStore({
  id: 'user',
  state: () => ({
    account: {
      name:'',
      password:''
    },
  }),
  getters: {
    getAccount() {
      return this.account;
    },
  },
  actions: {
    setAccount(account) {
      this.account = account;
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'account',
        storage: localStorage,
        paths: ['account'],
      },
    ],
  },
});

export const loginStore = defineStore({
  id: 'login',
  state: () => ({
    isLogin: null,
  }),
  getters: {
    getLoginStatus() {
      return this.isLogin;
    },
  },
  actions: {
    setLoginStatus(isLogin) {
      this.isLogin = isLogin;
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'isLogin',
        storage: localStorage,
        paths: ['isLogin'],
      },
    ],
  },
});

// 需要在 setup 之外使用
export function tokenStoreWidthOut() {
  return tokenStore(store);
}

export function accountStoreWidthOut() {
  return accountStore(store);
}

export function loginStoreWidthOut() {
  return loginStore(store);
}
