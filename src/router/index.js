import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../view/HomeView.vue'
import LoginView from '../view/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
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
