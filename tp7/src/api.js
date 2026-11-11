// L'API peut renvoyer un tableau nu ou un objet { success, data: [...] } :
// on gère les deux cas. Les champs sont ensuite ramenés à une forme commune.

export function listePays(json) {
  if (Array.isArray(json)) return json
  return (json && json.data) || []
}

export function premierPays(json) {
  if (Array.isArray(json)) return json[0] ?? null
  if (json && Array.isArray(json.data)) return json.data[0] ?? null
  return json ?? null
}

export function normaliser(p) {
  const capitale = Array.isArray(p.country_capital) ? p.country_capital[0] : p.country_capital
  const continents = Array.isArray(p.country_continents)
    ? p.country_continents.join(', ')
    : p.country_continents
  return {
    id: p.id,
    name: p.country_name || '—',
    cca2: p.country_cca2 || '',
    cca3: p.country_cca3 || '',
    emoji: p.country_flag || '',
    svg: p.country_flag_svg || '',
    capital: capitale || '',
    continent: continents || '',
    currencies: Object.values(p.country_currencies || {})
      .map(c => (c && c.name) || '')
      .filter(Boolean)
      .join(', '),
    languages: Object.values(p.country_languages || {}).join(', ')
  }
}
