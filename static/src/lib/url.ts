/**
 * Prepends the deployment base path (VITE_PREFIX) to a URL path.
 *
 * Locally (no VITE_PREFIX set): base is '/', url('/') → '/'
 * Production (VITE_PREFIX=/static/): base is '/static/', url('/') → '/static/'
 *
 * Usage:
 *   import { url } from '../lib/url';
 *   <a href={url('/')}>Home</a>
 *   <img src={url('/images/cms/logo.svg')} />
 *
 * @param {string} path  Root-relative path, e.g. '/' or '/about'
 * @returns {string}
 */
export function url(path: string = '/'): string {
    if (/^https?:\/\//.test(path) || path.startsWith('//')) {
        return path;
    }

    const base = import.meta.env.BASE_URL.replace(/\/$/, '');
    const normalised = path.startsWith('/') ? path : `/${path}`;

    return `${base}${normalised}`;
}
