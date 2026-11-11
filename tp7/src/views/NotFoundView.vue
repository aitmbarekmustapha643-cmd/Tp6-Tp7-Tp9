<template>
  <h1>Explorateur de pays</h1>

  <p class="loading" v-show="loading">Chargement des pays...</p>
  <p class="error" v-if="error">{{ error }}</p>

  <div class="toolbar">
    <input v-model="recherche" placeholder="Rechercher un pays..." />
  </div>

  <p v-if="!loading && !error && paysAffiches.length === 0">Aucun pays ne correspond.</p>
  <div class="grid">
    <CountryCard v-for="country in paysAffiches" :key="country.id" :country="country" />
  </div>
</template>

<script>
import CountryCard from '../components/CountryCard.vue'
import { API_BASE, API_KEY, API_KEY_OK } from '../config.js'
import { listePays, normaliser } from '../api.js'

// Limite à 250 pays. Les champs demandés dépassent le forfait BASIC :
// ceux qui manquent reviennent vides (affichés « — »).
const API_URL =
  `${API_BASE}/countries/all?apikey=${encodeURIComponent(API_KEY)}` +
  `&limit=250&fields=country_name,country_cca2,country_cca3,country_flag,country_capital,country_continents`

export default {
  name: 'CountryListView',
  components: { CountryCard },
  data() {
    return {
      countries: [],
      loading: true,
      error: null,
      recherche: ''
    }
  },
  computed: {
    // Filtre sur le nom, insensible à la casse, puis tri alphabétique
    paysAffiches() {
      const q = this.recherche.trim().toLowerCase()
      return this.countries
        .filter(c => c.name.toLowerCase().includes(q))
        .sort((a, b) => a.name.localeCompare(b.name, 'fr'))
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
      try {
        const reponse = await fetch(API_URL)
        // fetch ne rejette que sur une panne réseau : il faut vérifier reponse.ok
        if (!reponse.ok) throw new Error(`Erreur ${reponse.status}`)
        const json = await reponse.json()
        this.countries = listePays(json).map(normaliser)
      } catch (e) {
        console.error(e)
        this.error = 'Impossible de charger les pays.'
      } finally {
        this.loading = false
      }
    }
  },
  mounted() {
    this.chargerPays()
  }
}
</script>
