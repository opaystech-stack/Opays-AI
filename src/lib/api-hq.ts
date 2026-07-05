/**
 * Service de communication entre le site vitrine opays.io et l'API d'administration Opays HQ.
 */

export function getHqApiUrl(endpoint: string): string {
  // En local, on utilise le proxy configuré sur /api
  if (
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname.startsWith('192.168.'))
  ) {
    return `/api/public/site${endpoint}`;
  }

  // En production, on cible l'URL absolue de l'instance d'administration d'Opays HQ
  const hqBaseUrl = import.meta.env.VITE_HQ_API_URL || 'https://hq.opays.io';
  return `${hqBaseUrl}/api/public/site${endpoint}`;
}

/**
 * Enregistre anonymement une visite de page (Audience & Trafic).
 */
export async function trackPageView(url: string, referrer: string) {
  try {
    const endpointUrl = getHqApiUrl('/track');
    await fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        referrer,
      }),
    });
  } catch (err) {
    // Échec silencieux du tracking pour ne pas perturber l'expérience utilisateur
    console.warn('[Analytics] Échec de la remontée du tracking :', err);
  }
}
