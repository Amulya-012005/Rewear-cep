import brandLogo from './images/rewear_brand_logo_1792598309821.jpg';

// REWEAR_LOGO_URL is bundled by Vite for production builds on Vercel and local dev.
// Fallback path /logo.jpg is served from public/ directory as a safeguard.
export const REWEAR_LOGO_URL: string = brandLogo || '/logo.jpg';
export const REWEAR_FALLBACK_LOGO = '/logo.jpg';

export default REWEAR_LOGO_URL;
