# Forest Dew Udawalawa — Navigation Fix (29 October 2026)

## What was broken

The global currency click handler in `assets/js/main.js` matched `[data-currency]` on the `<html>` element. Because `<html>` contains every link, it interpreted clicks on **all** page links as currency selection and called `preventDefault()`. This blocked native page navigation.

## Fixes applied

1. Restricted the currency button update logic and click event selector to actual currency controls (`button[data-currency]`, `a[data-currency]`, or `[role="button"][data-currency]`). The `<html data-currency="...">` state remains unchanged for currency display, but no longer intercepts clicks or accidentally acquires button classes and ARIA state.
2. Kept the mobile drawer below the fixed header in the stacking order so the mobile menu toggle remains clickable to close the drawer.
3. Added safe storage reads/writes so browsers with disabled localStorage still initialize the navigation and theme controls. The theme bootstrap on normal production HTML pages also handles unavailable storage.
4. Adjusted the mobile navigation current-page detection to use its existing `data-link` attribute. Native `href` navigation remains intact.

**Preserved:** Original page layout, text, room/safari rates, styling, photos, logos, animation effects, existing links, forms and booking implementation.

## Checks performed

- Verified 328 internal relative links across the 10 content pages and 404 page resolve to files in the package.
- Checked 10 pages at desktop (1440px) and mobile (390px) width in Chromium with locally injected source assets.
- Verified primary navigation clicks are **not** prevented, the mobile drawer opens and closes, and the tested pages have no runtime JavaScript errors (without external CDN libraries).
- Source JS passed JavaScript syntax checks.

## Publishing the complete website

For Cloudflare Pages or GitHub Pages, publish **all** the site files together, not just `index.html`. `index.html`, `rooms.html`, `safari.html`, `experiences.html`, `gallery.html`, `about.html`, `contact.html`, etc. must be siblings at the actual site root, with the `assets/` directory next to them. This is a static HTML/CSS/JS site: no PHP/build process is needed. Refresh the browser cache after deployment (Ctrl+Shift+R).

The site was verified as a local static package; this fix has not been deployed to a live domain.
