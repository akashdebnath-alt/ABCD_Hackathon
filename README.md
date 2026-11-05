# SafeWalk

SafeWalk is a browser-based walking route demo. The planner uses Leaflet and OpenStreetMap for the map, Photon for place search, and the public FOSSGIS foot-routing demo service for walking directions. No API key or package installation is required.

## Run locally

From the project directory, start a local web server:

```powershell
py -m http.server 8000
```

Then open <http://localhost:8000> in your browser. Press `Ctrl+C` in the terminal to stop the server. Geolocation works on localhost (or another secure context) after you allow the browser permission.

## What works

- Search for a starting place and destination and view a walking route.
- Optionally use the browser's current location as the starting point.
- Start and stop browser-only live location tracking, with an optional manually shared map link.
- Share route details using the browser share sheet or clipboard.
- View an explicitly illustrative route indicator based on the sample zones in `data/zones.json` (Delhi only).

## Limitations and privacy

The map, place search, and routing depend on public services and an internet connection; their availability and usage limits are outside this project's control. Entered places and route coordinates are sent to the respective map/search/routing providers when you request a route. Geolocation is requested only after pressing “Use my current location.” SafeWalk does not save or transmit location to Firebase.

The Delhi zones and route indicator are mock data, not verified safety information. They must not be used to assess real-world risk. Live tracking runs only in the open browser page and does not upload or save location; sharing is manual and includes the current coordinates in an OpenStreetMap link. Firebase is not configured.

## Project files

- `index.html` — map and route planner
- `track.html` — live tracking placeholder
- `css/style.css` — responsive shared styling
- `js/map.js` — geocoding, walking directions, map, and location permission
- `js/track.js` — browser-only live location tracking
- `js/score.js` — illustrative mock-zone indicator
- `js/share.js` — route sharing
- `js/firebase.js` — reserved Firebase placeholder (not loaded by the planner)
- `data/zones.json` — illustrative Delhi sample zones
