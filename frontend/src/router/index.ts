import Vue       from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Leads     from '../views/Leads.vue'
import Lead      from '../views/Lead.vue'
import Calendar  from '../views/Calendar.vue'
import Import    from '../views/Import.vue'
import Home      from '../views/Home.vue'
import Layout    from '../views/Layout.vue'
import Login     from '../views/Login.vue'
import Setup     from '../views/Setup.vue'
import * as Auth from '@/core/auth';

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
    {
        path: '/login',
        name: 'Login',
        component: Login,
        props: true
    },
    {
        path: '/setup',
        name: 'Setup',
        component: Setup,
    },
    {
      path: '',
      name: '',
      component: Layout,
      children: [
          {
              path: '/',
              name: 'Home',
              component: Home 
          },
          {
              path: '/leads',
              name: 'Leads',
              component: Leads 
          },
          {
              path: '/leads/:id',
              name: 'Lead',
              component: Lead,
              props: true
          },
          {
              path: '/calendar',
              name: 'Calendar',
              component: Calendar 
          },
          {
              path: '/import',
              name: 'Import',
              component: Import 
          },
      ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

//Auth
router.beforeEach( async (to, from, next) => {
    while (Auth.user.isLoading) {
        await new Promise(r => setTimeout(r,200));
    }
    if      ( to.name === 'Setup' && !Auth.user.isSetup)                              next()
    else if ( !Auth.user.isSetup)                                                     next({name: 'Setup'})
    else if ( to.name === 'Setup' && Auth.user.isSetup && !Auth.user.isAuthenticated) next({name: 'Login'})
    else if ( to.name === 'Setup' && Auth.user.isSetup && Auth.user.isAuthenticated)  next({name: 'Home'})
    else if ( to.name === 'Login' && Auth.user.isAuthenticated)                       next({name: 'Home'})
    else if ( to.name !== 'Login' && !Auth.user.isAuthenticated)                      next({name: 'Login', params: { redirect: to.fullPath }})
    else next()
})

export default router
