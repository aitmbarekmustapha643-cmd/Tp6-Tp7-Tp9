<template>
  <div v-if="student" class="fiche">
    <h1>{{ student.firstName }} {{ student.lastName }}</h1>

    <!-- 4. Édition directe : les champs modifient store.students -->
    <label>Filière
      <input type="text" v-model.trim="student.filiere" />
    </label>
    <label>Année
      <select v-model.number="student.year">
        <option v-for="a in [1, 2, 3, 4, 5]" :key="a" :value="a">{{ a }}</option>
      </select>
    </label>
    <label>Email
      <input type="email" v-model.trim="student.email" />
    </label>
  </div>
  <div v-else>
    <p>Étudiant introuvable.</p>
  </div>

  <p><button @click="$router.back()">Retour</button></p>
</template>

<script>
import { store } from '../store/students.js'

export default {
  name: 'StudentDetailView',
  computed: {
    // 3. $route.params.id est une chaîne : on convertit en nombre
    student() {
      const id = Number(this.$route.params.id)
      return store.students.find(s => s.id === id)
    }
  }
}
</script>
