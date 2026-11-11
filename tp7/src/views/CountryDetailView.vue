import { createRouter, createWebHistory } from 'vue-router'
import CountryListView from '../views/CountryListView.vue'
import CountryDetailView from '../views/CountryDetailView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const routes = [
  { path: '/', name: 'list', component: CountryListView },
  { path: '/pays/:code', name: 'detail', component: CountryDetailView },
  { path: '/:catchAll(.*)', name: 'not-found', component: NotFoundView }
]

export default createRouter({ history: createWebHistory(), routes })
