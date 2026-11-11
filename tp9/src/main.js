<!--
 TP9 -- Meteo en direct.
 Le gabarit (template) est deja cable sur les donnees : il n'y a rien a
 modifier dans la partie template. Tout le travail est dans les methodes
 et la computed de la partie script, marquees TODO 1 a 6.
-->
<template>
  <div class="app">
    <header class="topbar">
      <h1>Météo en direct</h1>
      <button class="unit-toggle" @click="basculerUnite" v-if="ville">
        Afficher en {{ unite === 'metric' ? '°F' : '°C' }}
      </button>
    </header>

    <div class="search">
      <input
        v-model="query"
        @input="onInputRecherche"
        type="text"
        placeholder="Rechercher une ville... (ex: Safi, Paris, Tokyo)"
      />
      <p class="hint" v-if="chargementSuggestions">Recherche...</p>
      <p class="msg-error" v-if="erreurSuggestions">{{ erreurSuggestions }}</p>

      <ul class="suggestions" v-if="suggestions.length">
        <li v-for="s in suggestions" :key="s.lat + '-' + s.lon" @click="choisirVille(s)">
          {{ s.name }}<span v-if="s.state">, {{ s.state }}</span> ({{ s.country }})
        </li>
      </ul>
    </div>

    <div class="historique" v-if="historique.length">
      <span>Récent :</span>
      <button v-for="h in historique" :key="h.lat + '-' + h.lon" @click="choisirVille(h)">
        {{ h.name }}
      </button>
    </div>

    <div class="meteo" v-if="ville">
      <p class="loading" v-if="chargementMeteo">Chargement de la météo...</p>
      <p class="msg-error" v-else-if="erreurMeteo">{{ erreurMeteo }}</p>

      <div v-else-if="meteoActuelle" class="courante">
        <h2>{{ ville.name }}, {{ ville.country }}</h2>
        <div class="temp-actuelle">
          <img :src="iconeUrl(meteoActuelle.weather[0].icon)" :alt="meteoActuelle.weather[0].description" />
          <span class="valeur">{{ Math.round(meteoActuelle.main.temp) }}°</span>
          <span class="description">{{ meteoActuelle.weather[0].description }}</span>
        </div>
        <p class="details">
          Ressenti {{ Math.round(meteoActuelle.main.feels_like) }}° · Humidité {{ meteoActuelle.main.humidity }}%
        </p>
      </div>

      <div class="previsions" v-if="previsionsParJour.length">
        <div class="jour" v-for="j in previsionsParJour" :key="j.date">
          <span class="date">{{ j.date }}</span>
          <img :src="iconeUrl(j.icone)" :alt="j.description" />
          <span class="temps">{{ Math.round(j.min) }}° / {{ Math.round(j.max) }}°</span>
        </div>
      </div>
    </div>

    <p class="empty" v-if="!ville">Cherchez une ville pour voir sa météo.</p>
  </div>
</template>

<script>
// La cle est lue depuis .env (jamais committee -- voir .env.example et le sujet).
const API_KEY = import.meta.env.VITE_OWM_API_KEY
const GEO_URL = 'https://api.openweathermap.org/geo/1.0/direct'
const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather'
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast'

// Messages d'erreur selon le code HTTP renvoyé par l'API
function messageErreur(status) {
  if (status === 401) return 'Clé API invalide ou absente.'
  if (status === 429) return 'Quota dépassé : réessayez plus tard.'
  return 'Impossible de contacter le service météo.'
}

function chargerHistorique() {
  try {
    return JSON.parse(localStorage.getItem('historique') || '[]')
  } catch {
    return []
  }
}

export default {
  name: 'App',
  data() {
    return {
      query: '',
      debounceTimer: null,
      dernierAppelSuggestion: 0, // numéro de la dernière recherche lancée
      suggestions: [],
      chargementSuggestions: false,
      erreurSuggestions: null,

      ville: null, // { name, country, state, lat, lon }
      historique: chargerHistorique(),

      meteoActuelle: null,
      previsions: [], // tableau brut renvoye par /forecast (tranches de 3h)
      chargementMeteo: false,
      erreurMeteo: null,

      unite: 'metric' // 'metric' (°C) | 'imperial' (°F)
    }
  },
  computed: {
    // Regroupe les tranches de 3h par jour : min et max de la journée,
    // icône de la tranche la plus proche de midi.
    previsionsParJour() {
      const groupes = {}
      for (const p of this.previsions) {
        const [date, heure] = p.dt_txt.split(' ')
        if (!groupes[date]) {
          groupes[date] = { date, min: Infinity, max: -Infinity, tranches: [] }
        }
        const g = groupes[date]
        g.min = Math.min(g.min, p.main.temp_min)
        g.max = Math.max(g.max, p.main.temp_max)
        g.tranches.push({ heure: Number(heure.slice(0, 2)), meteo: p.weather[0] })
      }
      return Object.values(groupes)
        .map(g => {
          const proche = g.tranches.reduce((best, t) =>
            Math.abs(t.heure - 12) < Math.abs(best.heure - 12) ? t : best
          )
          return {
            date: g.date,
            min: g.min,
            max: g.max,
            icone: proche.meteo.icon,
            description: proche.meteo.description
          }
        })
        .sort((a, b) => a.date.localeCompare(b.date))
    }
  },
  methods: {
    iconeUrl(code) {
      return `https://openweathermap.org/img/wn/${code}@2x.png`
    },

    // TODO 1 : déclenchée à chaque frappe. Annule le minuteur précédent, puis
    // programme la recherche ~400 ms après la dernière frappe.
    onInputRecherche() {
      clearTimeout(this.debounceTimer)
      if (!this.query.trim()) {
        this.suggestions = []
        this.erreurSuggestions = null
        return
      }
      this.debounceTimer = setTimeout(() => this.rechercherVilles(), 400)
    },

    // TODO 2 : appelle l'API de géocodage et remplit suggestions.
    async rechercherVilles() {
      const q = this.query.trim()
      if (!q) return

      if (!API_KEY) {
        this.erreurSuggestions = 'Clé API manquante : crée le fichier .env (voir .env.example).'
        return
      }

      // Numéro de cette recherche : une réponse plus ancienne n'écrase pas une plus récente
      const numero = ++this.dernierAppelSuggestion
      this.chargementSuggestions = true
      this.erreurSuggestions = null
      try {
        const reponse = await fetch(`${GEO_URL}?q=${encodeURIComponent(q)}&limit=5&appid=${API_KEY}`)
        if (numero !== this.dernierAppelSuggestion) return
        if (!reponse.ok) throw new Error(`Erreur ${reponse.status}`)

        const donnees = await reponse.json()
        this.suggestions = donnees
        // Pas d'erreur HTTP pour une ville introuvable : tableau vide, 200 OK
        if (donnees.length === 0) {
          this.erreurSuggestions = `Aucune ville trouvée pour « ${q} ».`
        }
      } catch (e) {
        if (numero !== this.dernierAppelSuggestion) return
        console.error(e)
        this.suggestions = []
        this.erreurSuggestions = messageErreur(Number(e.message.replace('Erreur ', '')) || 0)
      } finally {
        if (numero === this.dernierAppelSuggestion) this.chargementSuggestions = false
      }
    },

    // TODO 3 : appelée depuis une suggestion OU l'historique (même forme d'objet).
    choisirVille(ville) {
      this.suggestions = []
      this.query = ''
      this.erreurSuggestions = null
      this.ville = {
        name: ville.name,
        country: ville.country,
        state: ville.state,
        lat: ville.lat,
        lon: ville.lon
      }
      // En tête de l'historique, sans doublon (même lat/lon), 5 éléments maximum
      const autres = this.historique.filter(h => !(h.lat === ville.lat && h.lon === ville.lon))
      this.historique = [this.ville, ...autres].slice(0, 5)
      try {
        localStorage.setItem('historique', JSON.stringify(this.historique))
      } catch {
        // stockage indisponible : l'historique reste seulement en mémoire
      }
      this.chargerMeteo()
    },

    // TODO 4 : météo actuelle ET prévisions en parallèle avec Promise.all.
    async chargerMeteo() {
      const { lat, lon } = this.ville
      this.chargementMeteo = true
      this.erreurMeteo = null
      try {
        const [rActuelle, rPrevisions] = await Promise.all([
          fetch(`${WEATHER_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${this.unite}&lang=fr`),
          fetch(`${FORECAST_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${this.unite}&lang=fr`)
        ])
        if (!rActuelle.ok) throw new Error(`Erreur ${rActuelle.status}`)
        if (!rPrevisions.ok) throw new Error(`Erreur ${rPrevisions.status}`)

        const [actuelle, previsions] = await Promise.all([rActuelle.json(), rPrevisions.json()])
        this.meteoActuelle = actuelle
        this.previsions = previsions.list
      } catch (e) {
        console.error(e)
        this.meteoActuelle = null
        this.previsions = []
        this.erreurMeteo = messageErreur(Number(e.message.replace('Erreur ', '')) || 0)
      } finally {
        this.chargementMeteo = false
      }
    },

    // TODO 5 : bascule l'unité puis refait l'appel (units= vient de l'API).
    basculerUnite() {
      this.unite = this.unite === 'metric' ? 'imperial' : 'metric'
      if (this.ville) this.chargerMeteo()
    }
  }
}
</script>
