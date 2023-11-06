import { defineStore } from 'pinia';
import { store } from './index';


const uploadInfo = defineStore('uploadInfo',{
  state: () => ({
    videoURL: '',
    coverURLList: [],
  }),
  getters: {
    getVideoURL() {
        return this.videoURL;
    },
    getCoverURLList() {
        return this.coverURLList;
    },
  },
  actions: {
    async setVideoURL(url) {
      this.videoURL = url;
    },
    async setCoverURLList(urlList) {
        this.coverURLList = urlList;
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        storage: localStorage,
        paths: ['uploadInfo'],
      },
    ],
  },
});


export default function uploadInfoStoreWidthOut() {
  return uploadInfo(store);
}
