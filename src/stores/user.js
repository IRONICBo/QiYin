import { defineStore } from 'pinia';
import { store } from './index';
import StorageUtil from '../utils/localStorage';


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
      StorageUtil.set("token",token)
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
  id: 'accountId',
  state: () => ({
    accountId: '',
  }),
  getters: {
    getAccount() {
      return this.accountId;
    },
  },
  actions: {
    setAccountId(id) {
      this.accountId = id;
      StorageUtil.set("accountId",id)
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'accountId',
        storage: localStorage,
        paths: ['accountId'],
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
