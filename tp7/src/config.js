// Configuration de l'API countrydataapi.
// La clé est lue depuis le fichier .env (variable VITE_CDA_API_KEY).
export const API_BASE = 'https://api.countrydataapi.com/v1'
export const API_KEY = import.meta.env.VITE_CDA_API_KEY ?? ''
export const API_KEY_OK = Boolean(API_KEY)
