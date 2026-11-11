import { createRouter, createWebHistory } from 'vue-router'
import StudentListView from '../views/StudentListView.vue'
import StudentDetailView from '../views/StudentDetailView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const routes = [
  { path: '/', name: 'annuaire', component: StudentListView },
  { path: '/etudiant/:id', name: 'etudiant', component: StudentDetailView },
  // Catch-all : toute autre URL affiche la page 404
  { path: '/:catchAll(.*)', name: 'notFound', component: NotFoundView }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
