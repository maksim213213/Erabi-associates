import type { APIRoute } from 'astro'
import { SITE } from '../data/site.js'

// Generated at build time so the Sitemap line always matches the site URL.
export const GET: APIRoute = ({ site }) => {
  const base = (site ?? new URL(SITE.url)).toString().replace(/\/+$/, '')
  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${base}/sitemap-index.xml`,
    '',
  ].join('\n')
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
