import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Leads    from '../views/Leads.vue'
import Lead     from '../views/Lead.vue'
import Calendar from '../views/Calendar.vue'
import Import   from '../views/Import.vue'
import Home   from '../views/Home.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
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

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
