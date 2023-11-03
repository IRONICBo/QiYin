import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../view/LoginView.vue'

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
          path: '/upload_info',
          name: 'upload_info',
          component: () => import('@/view/uploadInfo/index.vue')
        },
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
