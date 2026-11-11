<template>
  <p class="loading" v-show="loading">Chargement...</p>
  <p class="error" v-if="error">{{ error }}</p>

  <div v-if="country">
    <img v-if="country.svg" :src="country.svg" :alt="`Drapeau ${country.name}`" class="drapeau-svg" />
    <div v-else class="flag big">{{ country.emoji }}</div>
    <h1>{{ country.name }}</h1>
    <p>Code : {{ country.cca2 }} / {{ country.cca3 || '—' }}</p>
    <p>Capitale : {{ country.capital || '—' }}</p>
    <p>Continent : {{ country.continent || '—' }}</p>
    <p>Monnaie : {{ country.currencies || '—' }}</p>
    <p>Langues : {{ country.languages || '—' }}</p>
  </div>

  <button @click="$router.back()">Retour</button>
</template>

<script>
import { API_BASE, API_KEY, API_KEY_OK } from '../config.js'
import { premierPays, normaliser } from '../api.js'

export default {
  name: 'CountryDetailView',
  data() {
    return {
      country: null,
      loading: true,
      error: null
    }
  },
  methods: {
    async chargerPays() {
      if (!API_KEY_OK) {
        this.error = 'Clé API manquante : ajoute VITE_CDA_API_KEY dans le fichier .env.'
        this.loading = false
        return
      }
      this.loading = true
      this.error = null
      this.country = null
      try {
        const code = encodeURIComponent(this.$route.params.code)
        const url =
          `${API_BASE}/countries/code?apikey=${encodeURIComponent(API_KEY)}` +
          `&code=${code}&fields=country_name,country_cca2,country_cca3,country_flag,country_flag_svg,` +
          `country_capital,country_continents,country_currencies,country_languages`
        const reponse = await fetch(url)
        if (!reponse.ok) throw new Error(`Erreur ${reponse.status}`)
        const pays = premierPays(await reponse.json())
        if (!pays) throw new Error('Pays vide')
        this.country = normaliser(pays)
      } catch (e) {
        console.error(e)
        this.error = 'Impossible de charger ce pays.'
      } finally {
        this.loading = false
      }
    }
  },
  // Recharge quand le code change sans démontage du composant
  watch: {
    '$route.params.code'() {
      this.chargerPays()
    }
  },
  mounted() {
    this.chargerPays()
  }
}
</script>
