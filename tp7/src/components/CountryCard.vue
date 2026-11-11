<template>
  <router-link :to="`/pays/${country.cca2}`" class="country-card">
    <div class="flag">{{ country.emoji }}</div>
    <h3>{{ country.name }}</h3>
    <p>{{ country.capital || '—' }}</p>
    <p>{{ country.continent || '—' }}</p>
  </router-link>
</template>

<script>
export default {
  name: 'CountryCard',
  props: {
    country: { type: Object, required: true }
  }
}
</script>
