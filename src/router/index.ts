import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import UserView from '../views/UserView.vue'
import PostView from '../views/PostView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: 'home',
      path: '/',
      component: HomeView
    },
    {
      name: 'user',
      path: '/user/:username',
      component: UserView
    },
    {
      name: 'post',
      path: '/post/:id',
      component: PostView
    }
  ]
})

export default router
