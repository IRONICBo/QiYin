import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../view/LoginView.vue'
import UploadVideo from '../view/uploadVideo/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/view/layout/index.vue'),
      children: [
        {
          path: '/upload',
          name: 'upload',
          component: () => import('@/view/upload/index.vue')
        },
        {
          path: '/searchResult',
          name: 'searchResult',
          component: () => import('@/view/searchResult/index.vue')
        },
        {
          path: '/uploadInfo',
          name: 'uploadInfo',
          component: () => import('@/view/uploadInfo/index.vue')
        },
        {
          path: '/uploadVideo',
          name: 'uploadVideo',
          component: () => import('@/view/uploadVideo/index.vue')
        },
        // {
        //   path: '/personalInfo',
        //   name: 'personalInfo',
        //   component: () => import('@/view/personalInfo/index.vue')
        // },
        {
          path: '/userInfo',
          name: 'userInfo',
          component: () => import('@/view/user/index.vue')
        },
        {
          path: '/videoTag',
          name: 'videoTag',
          component: () => import('@/view/videoTag/index.vue')
        }
      ]
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../view/AboutView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component:LoginView
    },
    // {
    //   path: '/user',
    //   name: 'user',
    //   component:UserView
    // }
  ]
})

export default router
