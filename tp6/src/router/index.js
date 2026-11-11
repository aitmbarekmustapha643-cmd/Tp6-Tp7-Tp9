<template>
  <div class="student-card">
    <span>{{ student.firstName }} {{ student.lastName }}</span>
    <span class="filiere-badge">{{ student.filiere }}</span>
    <router-link :to="`/etudiant/${student.id}`">Voir la fiche</router-link>
  </div>
</template>

<script>
export default {
  name: 'StudentCard',
  props: {
    student: { type: Object, required: true }
  }
}
</script>
