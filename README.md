# SafeWalk

SafeWalk is a responsive, browser-only walking-route and personal safety demo built with plain HTML, CSS, and vanilla JavaScript. It has no application backend, framework, build step, API key, or dependency manifest.

## Run locally

Use VS Code's Live Server extension and open `index.html`, or run a static server from the `safewalk` directory:

```powershell
npx --yes http-server . -p 8000
```

Open <http://localhost:8000>. The `npx` command is only a local static-file server; it does not add a package or `package.json` to this project. A localhost/HTTPS origin is required for browser geolocation, service workers, and installable PWA behavior. Stop the server with `Ctrl+C`.

## Folder structure

```text
safewalk/
├── index.html             # Walking route planner and recent places
├── track.html             # Saved trip and one-time sharing
├── safety.html            # Emergency links and optional safety demos
├── privacy.html           # Data-use explanation and clear-data action
├── offline.html           # Graceful offline fallback
├── manifest.json          # Installable web app metadata
├── sw.js                  # Same-origin app-shell cache
├── assets/
│   └── icon.svg
├── css/
│   └── style.css          # Shared responsive, dark-mode design system
├── js/
│   ├── app.js             # Onboarding, connectivity, service-worker setup
│   ├── utils.js           # Storage, sanitization, and accessible toasts
│   ├── map.js             # Lazy map, search, walking route, recent places
│   ├── score.js           # Illustrative sample-zone indicator
│   ├── share.js           # User-triggered share/clipboard helpers
│   ├── track.js           # Saved trip and one-time location sharing
│   ├── safety.js          # Trusted contact, alert sharing, visual demos
│   └── privacy.js         # User-requested local data clearing
└── data/
    └── zones.json         # Illustrative Delhi demo zones
```

## Features

- Responsive route planner with lazy-loaded Leaflet map, place search, walking route, distance, and estimated time.
- Current-location starting point and one-time location sharing request browser permission only after the user presses the related button.
- Recent place searches and saved trip information are kept in this browser's local storage.
- Optional trusted-contact name and phone number are stored on-device; the call link opens the device's dialer.
- Sharing uses the browser share sheet or a user-controlled copy/prompt fallback. The user chooses a recipient and sends the message.
- A visual-only fake-call screen and quick screen cover; neither makes a call or sends an alert.
- First-visit explanation, privacy page and clear-data action, responsive desktop/mobile navigation, keyboard focus styling, reduced-motion support, and system dark mode.
- PWA manifest and service worker cache same-origin app files for offline page access. An offline banner explains that maps, search, routes, and external sharing require a connection.

## Important limits and privacy

- There is no live tracking, background location, guardian account, automatic SOS, or emergency dispatch. The 112/1091/181 links open the device's phone app.
- The safety-zone file contains illustrative Delhi sample data only. The numeric demo indicator is not verified safety information and must not be used as a real-world risk assessment.
- Place names are sent to Photon for geocoding when a route is requested; route coordinates are sent to the public FOSSGIS walking-routing service. Map tiles come from OpenStreetMap. These services may receive network metadata such as an IP address under their own policies.
- SafeWalk itself has no server. Saved trip, recent-place, contact, and onboarding values remain in browser local storage until removed or cleared. Browser storage is not encrypted by this app.
- Clearing SafeWalk data removes those app-owned local-storage entries from this browser. It does not erase browser history, shared messages, service-worker cache, or information held by external services.
- Offline mode only serves the cached app shell and sample zone data. It cannot provide fresh maps, geocoding, routing, or guaranteed message delivery.

## Manual testing checklist

- [ ] Desktop: plan a route between two places; confirm route line, distance, ETA, and explicit demo-data wording.
- [ ] Desktop: save the trip, open Share trip, share/copy details, and remove the saved trip.
- [ ] Mobile viewport: check the bottom navigation, safe-area spacing, touch targets, and that page content is not hidden behind the navigation.
- [ ] Location denied: deny the browser permission; confirm the page explains how to continue without location and no location is requested on page load.
- [ ] Location allowed: press a location action; confirm a one-time link only appears in the chosen share/copy flow and no location stream starts.
- [ ] Offline: load once, disconnect the network, navigate to cached pages, and confirm the offline banner/fallback explains which features need a connection.
- [ ] Keyboard only: use Tab/Shift+Tab, Enter/Space, Escape, skip link, onboarding dialog, fake-call demo, and quick screen cover; confirm visible focus and focus remains in dialogs.
- [ ] Privacy: save a trusted contact and trip, clear SafeWalk data, reload, and confirm SafeWalk-owned entries are gone.
- [ ] Dark mode and reduced motion: enable each operating-system preference and check contrast, focus indicators, and animations.
- [ ] Emergency links: verify the link target only (`tel:112`, `tel:1091`, `tel:181`); do not place a test emergency call.
