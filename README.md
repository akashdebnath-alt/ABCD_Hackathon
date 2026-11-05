# SafeWalk

SafeWalk is a responsive, browser-only walking-route and personal safety demo built with plain HTML, CSS, and vanilla JavaScript. It has no application backend, framework, build step, API key, or dependency manifest.

## Run locally

Do not open `index.html` directly as a `file://` URL. Use a local web server so browser features such as geolocation and service workers work correctly.

**VS Code Live Server**

1. Open this project folder in VS Code and install the Live Server extension if needed.
2. Right-click `index.html` and select **Open with Live Server**, or select **Go Live** in the status bar.
3. In the browser, confirm the address starts with `http://localhost` or `http://127.0.0.1`.

**Python alternative**

From the project folder, run:

```powershell
py -m http.server 8000
```

Then open <http://localhost:8000>. Stop the server with `Ctrl+C`. If Python is unavailable, use Live Server. A localhost/HTTPS origin is required for browser geolocation, service workers, and installable PWA behavior.

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
│   ├── i18n.js            # English/Hindi language selection and translations
│   ├── map.js             # Lazy map, search, walking route, recent places
│   ├── share.js           # User-triggered share/clipboard helpers
│   ├── track.js           # Saved trip and one-time location sharing
│   ├── safety.js          # Trusted contact, alert sharing, visual demos
│   ├── export.js          # Copy and print route directions
│   └── privacy.js         # User-requested local data clearing
```

## Features

- Responsive route planner with lazy-loaded Leaflet map, up to five place matches, walking directions, and a route summary. These route details are not a safety assessment.
- Compare up to three walking routes when the public routing service returns alternatives. Selecting a route updates the map, distance, estimated time, and turn-by-turn steps. The default route is not a safety recommendation.
- Turn-by-turn steps when the public routing service provides them, plus a walk-time estimate based on 4.8 km/h; actual time varies with pace, crossings, terrain, and stops.
- Copy or print a route summary and its directions from the planner or saved-trip page.
- Select English or Hindi on the planner, trip-sharing, and safety pages. The language choice is saved in this browser.
- Edit or reopen a planned route from its summary or saved trip. Search results and routes rely on public services and explain when those services are unavailable.
- Current-location starting point and one-time location sharing request browser permission only after the user presses the related button. Current-location starts can use Photon to look up a place name; if precise location is unavailable, an optional approximate fallback uses ipapi.co after confirmation.
- Recent place searches and saved trip information are kept in this browser's local storage.
- Optional trusted-contact name and phone number are stored on-device; the call link opens the device's dialer.
- Interactive before, during, urgent-help, and arrival checklist. Checked items stay in this browser and can be reset or cleared from the privacy page.
- Sharing uses the browser share sheet or a user-controlled copy/prompt fallback. The user chooses a recipient and sends the message.
- A visual-only fake-call screen and quick screen cover; neither makes a call or sends an alert.
- First-visit explanation, privacy page and clear-data action, responsive desktop/mobile navigation, keyboard focus styling, reduced-motion support, and system dark mode.
- PWA manifest and service worker cache same-origin app files for offline page access. An offline banner explains that maps, search, routes, and external sharing require a connection.

## Important limits and privacy

- There is no live tracking, background location, guardian account, automatic SOS, or emergency dispatch. The 112/1091/181 links open the device's phone app.
- The app does not rate route safety. Route and travel-time estimates are not verified safety information; check local conditions and trusted official sources before your walk.
- The safety checklist is general preparation guidance, not exhaustive advice, emergency monitoring, or a guarantee of safety.
- Alternative routes compare distance and estimated walking time only. The app does not receive verified incident, lighting, or route-risk data.
- Place names are sent to Photon for geocoding when a route is requested; route coordinates are sent to the public FOSSGIS walking-routing service. When you use the current-location button, your coordinates are sent to Photon to look up the place name shown as the starting point. If precise location fails and you agree to the approximate fallback, your IP address is sent to ipapi.co. Map tiles come from OpenStreetMap. These services may receive network metadata such as an IP address under their own policies.
- SafeWalk itself has no server. Saved trip, recent-place, contact, language, and onboarding values remain in browser local storage until removed or cleared. Browser storage is not encrypted by this app.
- Clearing SafeWalk data removes those app-owned local-storage entries from this browser. It does not erase browser history, shared messages, service-worker cache, or information held by external services.
- Offline mode only serves cached app pages. It cannot provide fresh maps, geocoding, routing, or guaranteed message delivery.

## Manual testing checklist

- [ ] Desktop: search ambiguous place names, choose each correct match, and confirm the route line, turn-by-turn steps, 4.8 km/h estimate, and no safety rating.
- [ ] Desktop: edit a route from its summary, save it, reopen it from Share trip, share/copy details, and remove the saved trip.
- [ ] Copy and print the planner and saved-trip directions; confirm print output contains only the selected route summary.
- [ ] Switch between English and Hindi on the planner, trip-sharing, and safety pages; confirm the choice persists across pages and reloads.
- [ ] Mobile viewport: check the bottom navigation, safe-area spacing, touch targets, and that page content is not hidden behind the navigation.
- [ ] Location denied: deny the browser permission; confirm the page explains how to continue without location and no location is requested on page load.
- [ ] Location unavailable: confirm the approximate-location prompt explains IP sharing and declining leaves the starting point unchanged.
- [ ] Location allowed: press a location action; confirm a one-time link only appears in the chosen share/copy flow and no location stream starts.
- [ ] Offline: load once, disconnect the network, navigate to cached pages, and confirm the offline banner/fallback explains which features need a connection.
- [ ] Keyboard only: use Tab/Shift+Tab, Enter/Space, Escape, skip link, onboarding dialog, fake-call demo, and quick screen cover; confirm visible focus and focus remains in dialogs.
- [ ] Privacy: save a trusted contact and trip, clear SafeWalk data, reload, and confirm SafeWalk-owned entries are gone.
- [ ] Safety checklist: check items, reload to confirm progress is saved on this device, reset it, and verify privacy data clearing also removes checklist progress.
- [ ] Dark mode and reduced motion: enable each operating-system preference and check contrast, focus indicators, and animations.
- [ ] Emergency links: verify the link target only (`tel:112`, `tel:1091`, `tel:181`); do not place a test emergency call.
