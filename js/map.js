(function () {
  "use strict";

  const utils = window.SafeWalkUtils;
  const form = document.querySelector("#route-form");
  const originInput = document.querySelector("#origin");
  const destinationInput = document.querySelector("#destination");
  const locationButton = document.querySelector("#use-location");
  const submitButton = document.querySelector("#plan-route");
  const shareButton = document.querySelector("#share-route");
  const startTripButton = document.querySelector("#start-trip");
  const status = document.querySelector("#status");
  const result = document.querySelector("#route-result");
  const loading = document.querySelector("#route-loading");
  const mapPanel = document.querySelector(".map-panel");
  const mapElement = document.querySelector("#map");
  const mapHint = document.querySelector(".map-hint");
  const recentSection = document.querySelector("#recent-searches");
  const recentList = document.querySelector("#recent-list");

  const leafletCss = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
  const leafletScript = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
  let map;
  let mapLoading;
  let routeLayer;
  let currentRoute;
  let currentOrigin;

  function setStatus(message, isError) {
    status.textContent = message;
    status.classList.toggle("error", Boolean(isError));
  }

  function formatPlace(properties) {
    return (
      properties.name ||
      properties.street ||
      properties.city ||
      properties.state ||
      properties.country ||
      "Selected place"
    );
  }

  function loadStylesheet() {
    if (document.querySelector('link[data-leaflet-css]')) {
      return;
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = leafletCss;
    link.integrity =
      "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
    link.crossOrigin = "";
    link.dataset.leafletCss = "true";
    document.head.append(link);
  }

  function loadLeaflet() {
    if (window.L) {
      return Promise.resolve();
    }
    if (mapLoading) {
      return mapLoading;
    }

    loadStylesheet();
    mapLoading = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = leafletScript;
      script.integrity =
        "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
      script.crossOrigin = "";
      script.onload = () => resolve();
      script.onerror = () => {
        mapLoading = undefined;
        reject(new Error("Map couldn't load. Check your internet connection and try again."));
      };
      document.head.append(script);
    });

    return mapLoading;
  }

  async function ensureMap() {
    await loadLeaflet();
    if (map) {
      return;
    }

    map = L.map(mapElement).setView([28.6329, 77.2195], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    mapElement.querySelector(".map-placeholder")?.remove();
    window.setTimeout(() => map.invalidateSize(), 0);
  }

  async function geocode(query) {
    const url = new URL("https://photon.komoot.io/api/");
    url.searchParams.set("q", query);
    url.searchParams.set("limit", "1");

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Place search is unavailable right now. Try again when online.");
    }

    const data = await response.json();
    const feature = data.features && data.features[0];
    if (!feature) {
      throw new Error(`Couldn't find “${query}”. Try a nearby street or landmark.`);
    }

    return {
      coordinates: feature.geometry.coordinates,
      label: formatPlace(feature.properties),
    };
  }

  async function requestWalkingRoute(origin, destination) {
    const coordinates = [origin.coordinates, destination.coordinates]
      .map((point) => point.join(","))
      .join(";");
    const url = `https://routing.openstreetmap.de/routed-foot/route/v1/driving/${coordinates}?overview=full&geometries=geojson&alternatives=false&steps=false`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Walking directions are unavailable right now. Please try again.");
    }

    const data = await response.json();
    if (data.code !== "Ok" || !data.routes || !data.routes[0]) {
      throw new Error("No walking route was found. Try closer or different places.");
    }
    return data.routes[0];
  }

  function renderRecentSearches() {
    const recent = utils.getItem(utils.keys.recentSearches, []);
    recentList.replaceChildren();
    if (!Array.isArray(recent) || recent.length === 0) {
      recentSection.hidden = true;
      return;
    }

    recent.slice(0, 5).forEach((item) => {
      if (!item || typeof item.origin !== "string" || typeof item.destination !== "string") {
        return;
      }
      const entry = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = `${item.origin} → ${item.destination}`;
      button.addEventListener("click", () => {
        originInput.value = item.origin;
        destinationInput.value = item.destination;
        currentOrigin = undefined;
        form.requestSubmit();
      });
      entry.append(button);
      recentList.append(entry);
    });
    recentSection.hidden = recentList.childElementCount === 0;
  }

  function saveRecentSearch(origin, destination) {
    const recent = utils.getItem(utils.keys.recentSearches, []);
    const next = Array.isArray(recent) ? recent : [];
    const updated = [
      { origin, destination },
      ...next.filter(
        (item) => item.origin !== origin || item.destination !== destination,
      ),
    ].slice(0, 5);
    utils.setItem(utils.keys.recentSearches, updated);
    renderRecentSearches();
  }

  function showRoute(origin, destination, route) {
    if (routeLayer) {
      map.removeLayer(routeLayer);
    }

    const line = L.geoJSON(route.geometry, {
      style: { color: "#514294", weight: 5, opacity: 0.9 },
    });
    const bounds = line.getBounds();
    routeLayer = L.featureGroup([line]);

    [
      { place: origin, color: "#11766f", label: "Start" },
      { place: destination, color: "#a52b32", label: "Destination" },
    ].forEach(({ place, color, label }) => {
      const popup = document.createElement("span");
      popup.textContent = `${label}: ${utils.sanitizeText(place.label, 160)}`;
      const marker = L.circleMarker(
        [place.coordinates[1], place.coordinates[0]],
        { radius: 8, color: "#fff", weight: 3, fillColor: color, fillOpacity: 1 },
      ).bindPopup(popup);
      routeLayer.addLayer(marker);
      bounds.extend(marker.getLatLng());
    });

    routeLayer.addTo(map);
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });

    const distance = (route.distance / 1000).toFixed(1);
    const duration = Math.max(1, Math.round(route.duration / 60));
    document.querySelector("#route-summary").textContent =
      `${origin.label} to ${destination.label}`;
    document.querySelector("#route-distance").textContent = `${distance} km`;
    document.querySelector("#route-duration").textContent = `~${duration} min`;

    currentRoute = {
      origin: origin.label,
      destination: destination.label,
      distance,
      duration,
    };
    startTripButton.hidden = false;
    result.hidden = false;
    mapHint.hidden = true;
  }

  function startTrip() {
    if (!currentRoute) {
      return;
    }

    if (
      utils.setItem(utils.keys.activeTrip, {
        ...currentRoute,
        startedAt: new Date().toISOString(),
      })
    ) {
      window.location.href = "track.html";
    }
  }

  async function planRoute(event) {
    event.preventDefault();
    const originQuery = utils.sanitizeText(originInput.value, 160);
    const destinationQuery = utils.sanitizeText(destinationInput.value, 160);
    originInput.value = originQuery;
    destinationInput.value = destinationQuery;
    if (!originQuery || !destinationQuery) {
      setStatus("Enter both a starting point and a destination.", true);
      return;
    }
    if (!navigator.onLine) {
      setStatus("You're offline. Connect to the internet to search places and directions.", true);
      return;
    }

    currentRoute = undefined;
    result.hidden = true;
    loading.hidden = false;
    startTripButton.hidden = true;
    mapHint.hidden = false;
    if (routeLayer && map) {
      map.removeLayer(routeLayer);
      routeLayer = undefined;
    }
    submitButton.disabled = true;
    submitButton.querySelector(".button-label").textContent = "Finding a walking route…";
    setStatus("Searching for places and walking directions…");

    try {
      const usedCurrentLocation = Boolean(currentOrigin);
      const origin = currentOrigin || (await geocode(originQuery));
      const destination = await geocode(destinationQuery);
      await ensureMap();
      const route = await requestWalkingRoute(origin, destination);
      showRoute(origin, destination, route);
      if (!usedCurrentLocation) {
        saveRecentSearch(originQuery, destinationQuery);
      }
      setStatus("Route ready. Check local conditions before you set off.");
    } catch (error) {
      setStatus(
        error instanceof TypeError
          ? "Connection problem. Check your internet connection and public map services, then try again."
          : error.message || "Couldn't plan that route. Please try again.",
        true,
      );
    } finally {
      loading.hidden = true;
      submitButton.disabled = false;
      submitButton.querySelector(".button-label").textContent = "Show walking route";
    }
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setStatus("Location isn't supported by this browser. Enter a starting place instead.", true);
      return;
    }

    locationButton.disabled = true;
    setStatus("Waiting for your location permission…");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        currentOrigin = {
          coordinates: [coords.longitude, coords.latitude],
          label: "Your current location",
        };
        originInput.value = currentOrigin.label;
        locationButton.disabled = false;
        setStatus("Starting point set. Location is only used if you request directions.");
      },
      (error) => {
        const messages = {
          1: "Location permission was denied. Enter a starting place instead.",
          2: "Your location couldn't be determined. Try again or enter a place.",
          3: "Location request timed out. Try again or enter a place.",
        };
        locationButton.disabled = false;
        setStatus(messages[error.code] || "Couldn't access your location.", true);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    );
  }

  async function shareCurrentRoute() {
    if (!currentRoute) {
      return;
    }
    try {
      const method = await window.SafeWalkShare.shareRoute(currentRoute);
      const messages = {
        shared: "Share sheet opened for your route details.",
        copied: "Route details copied; paste them into your chosen app.",
        prompted: "Route details shown for you to copy.",
        cancelled: "Sharing cancelled; no message was sent.",
      };
      setStatus(messages[method]);
    } catch (error) {
      if (error.name !== "AbortError") {
        setStatus(`Couldn't share route details: ${error.message}`, true);
      }
    }
  }

  function initializeMapOnDemand() {
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            observer.disconnect();
            ensureMap().catch((error) => {
              utils.showToast(error.message, "error");
              mapElement.querySelector(".map-placeholder")?.replaceChildren(
                document.createTextNode(error.message),
              );
              mapElement.setAttribute("aria-label", error.message);
            });
          }
        },
        { rootMargin: "200px" },
      );
      observer.observe(mapPanel);
      return;
    }
    ensureMap().catch((error) => utils.showToast(error.message, "error"));
  }

  originInput.addEventListener("input", () => {
    currentOrigin = undefined;
  });
  form.addEventListener("submit", planRoute);
  locationButton.addEventListener("click", useCurrentLocation);
  shareButton.addEventListener("click", shareCurrentRoute);
  startTripButton.addEventListener("click", startTrip);
  document.querySelector("#clear-recents").addEventListener("click", () => {
    if (utils.removeItem(utils.keys.recentSearches)) {
      renderRecentSearches();
      utils.showToast("Recent places cleared.", "success");
    }
  });

  renderRecentSearches();
  initializeMapOnDemand();
})();
