# SafeWalk (Aura Raksha)

SafeWalk is a women's safety and live-tracking web app. UI built with the "Aegis Civic Safety" design system (deep indigo, empowering violet, safe-state emerald) via Tailwind CSS.

## Project files

- `index.html` — Safe Routes: route planning, route comparison (fastest vs safest), safe havens along route
- `track.html` — Live Guardian: live trip tracking, WhatsApp/SMS sharing, trusted guardian circle, auto safeguards
- `community.html` — Community Heatmap: city safety pulse, interactive corridor map, anonymous incident reporting
- `css/style.css` — shared custom styles (pages use Tailwind CDN by default; add overrides here)
- `js/map.js` — map and route behavior (hook point: elements with `data-location`, `#map`)
- `js/score.js` — route safety scoring (hook point: `.metric-display` elements, route % badges)
- `js/share.js` — sharing behavior (hook point: `#whatsapp-share-btn`, `#sms-share-btn`, `#copy-link-btn`)
- `js/firebase.js` — shared Firebase configuration
- `data/zones.json` — mock safety-zone data

All three HTML pages are fully designed and functional UI (visual-only — map data, scoring, and live tracking are still mock/static until wired to `js/*.js` and Firebase). Each page already loads `firebase.js`, `score.js`, `map.js`, and `share.js` in that order, so no HTML changes should be needed to wire in real logic — just implement the JS files.

## Branches

- `main` — structure + working UI
- `p1-map` — map/routing logic
- `p2-score` — safety scoring logic
- `p3-sharing` — live sharing/Firebase logic
- `p4-ui` — UI/design (this work)
