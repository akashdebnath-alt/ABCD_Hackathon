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
  const editRouteButton = document.querySelector("#edit-route");
  const status = document.querySelector("#status");
  const result = document.querySelector("#route-result");
  const loading = document.querySelector("#route-loading");
  const placeChoices = document.querySelector("#place-choices");
  const originChoices = document.querySelector("#origin-place-choices");
  const destinationChoices = document.querySelector("#destination-place-choices");
  const routeSteps = document.querySelector("#route-steps");
  const mapPanel = document.querySelector(".map-panel");
  const mapElement = document.querySelector("#map");
  const mapHint = document.querySelector(".map-hint");
  const recentSection = document.querySelector("#recent-searches");
  const recentList = document.querySelector("#recent-list");

  const WALKING_SPEED_KMH = 4.8;
  const leafletCss = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
  const leafletScript = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
  let map;
  let mapLoading;
  let routeLayer;
  let currentRoute;
  let currentOrigin;
  let pendingPlaces;

  function setStatus(message, isError) {
    status.textContent = message;
    status.classList.toggle("error", Boolean(isError));
  }

  async function fetchPublicService(url, serviceName) {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    try {
      return await fetch(url, { signal: controller.signal });
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error(
          `The public ${serviceName} service didn't respond in time. Check your connection or try again later.`,
        );
      }
      if (error instanceof TypeError) {
        throw new Error(
          `Couldn't reach the public ${serviceName} service. Check your connection or try again later.`,
        );
      }
      throw error;
    } finally {
      window.clearTimeout(timeout);
    }
  }

  function formatPlace(properties) {
    const primary =
      properties.name ||
      properties.street ||
      properties.city ||
      properties.state ||
      properties.country ||
      "Selected place";
    const details = [
      properties.street && properties.street !== primary
        ? properties.street
        : "",
      properties.city,
      properties.district,
      properties.state,
      properties.country,
    ].filter((value, index, values) => value && value !== primary && values.indexOf(value) === index);

    return details.length ? `${primary} — ${details.join(", ")}` : primary;
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
    url.searchParams.set("limit", "5");

    const response = await fetchPublicService(url, "place-search");
    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("The public place search is busy. Wait a moment and try again.");
      }
      throw new Error(
        `The public place search is temporarily unavailable (HTTP ${response.status}). Try again later.`,
      );
    }

    let data;
    try {
      data = await response.json();
    } catch {
      throw new Error("The public place-search service returned an invalid response. Please try again later.");
    }
    const places = (Array.isArray(data?.features) ? data.features : [])
      .filter((feature) => {
        const coordinates = feature?.geometry?.coordinates;
        return (
          Array.isArray(coordinates) &&
          coordinates.length >= 2 &&
          Number.isFinite(coordinates[0]) &&
          Number.isFinite(coordinates[1])
        );
      })
      .map((feature) => ({
        coordinates: feature.geometry.coordinates,
        label: formatPlace(feature.properties || {}),
      }));
    if (places.length === 0) {
      throw new Error(`Couldn't find “${query}”. Try a nearby street or landmark.`);
    }
    return places;
  }

  async function requestWalkingRoute(origin, destination) {
    const coordinates = [origin.coordinates, destination.coordinates]
      .map((point) => point.join(","))
      .join(";");
    const url = `https://routing.openstreetmap.de/routed-foot/route/v1/driving/${coordinates}?overview=full&geometries=geojson&alternatives=false&steps=true`;
    const response = await fetchPublicService(url, "walking-directions");
    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("The public walking-directions service is busy. Wait a moment and try again.");
      }
      throw new Error(
        `The public walking-directions service is temporarily unavailable (HTTP ${response.status}). Try again later.`,
      );
    }

    let data;
    try {
      data = await response.json();
    } catch {
      throw new Error("The public walking-directions service returned an invalid response. Please try again later.");
    }
    if (data?.code === "NoRoute") {
      throw new Error("No walking route was found. Try closer or different places.");
    }
    if (data?.code !== "Ok" || !data.routes || !data.routes[0]) {
      throw new Error(
        `The public walking-directions service couldn't calculate this route${data?.code ? ` (${data.code})` : ""}. Try again later.`,
      );
    }
    const routeCoordinates = data.routes[0].geometry?.coordinates;
    if (
      !Array.isArray(routeCoordinates) ||
      routeCoordinates.length < 2 ||
      routeCoordinates.some(
        (point) =>
          !Array.isArray(point) ||
          point.length < 2 ||
          !Number.isFinite(point[0]) ||
          !Number.isFinite(point[1]),
      )
    ) {
      throw new Error("The walking-directions service returned an invalid route. Please try again.");
    }
    if (!Number.isFinite(data.routes[0].distance) || data.routes[0].distance < 0) {
      throw new Error("The walking-directions service returned an invalid distance. Please try again.");
    }
    return data.routes[0];
  }

  function renderPlaceGroup(container, name, places, selectedIndex) {
    const list = document.createElement("div");
    list.className = "place-choice-list";
    places.forEach((place, index) => {
      const label = document.createElement("label");
      label.className = "place-choice";
      if (selectedIndex === index) {
        label.classList.add("selected");
      }

      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = name;
      radio.value = String(index);
      radio.checked = selectedIndex === index;
      const text = document.createElement("span");
      text.textContent = place.label;
      label.append(radio, text);
      list.append(label);
    });
    container.replaceChildren(list);
  }

  function renderPlaceChoices(matches) {
    renderPlaceGroup(
      originChoices,
      "origin-place",
      matches.origin,
      matches.originIndex,
    );
    renderPlaceGroup(
      destinationChoices,
      "destination-place",
      matches.destination,
      matches.destinationIndex,
    );

    const hasAmbiguousPlaces =
      matches.origin.length > 1 || matches.destination.length > 1;
    placeChoices.hidden = !hasAmbiguousPlaces;
    return hasAmbiguousPlaces;
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

  function formatStep(step) {
    if (typeof step.instruction === "string" && step.instruction.trim()) {
      return step.instruction.trim();
    }

    const maneuver = step.maneuver || {};
    const road = typeof step.name === "string" && step.name
      ? ` onto ${step.name}`
      : "";
    const turns = {
      left: "Turn left",
      right: "Turn right",
      "slight left": "Turn slightly left",
      "slight right": "Turn slightly right",
      "sharp left": "Turn sharply left",
      "sharp right": "Turn sharply right",
      uturn: "Make a U-turn",
    };

    if (maneuver.type === "depart") {
      return "Start walking";
    }
    if (maneuver.type === "arrive") {
      return "Arrive at your destination";
    }
    if (maneuver.type === "roundabout" || maneuver.type === "rotary") {
      return Number.isInteger(maneuver.exit)
        ? `At the roundabout, take exit ${maneuver.exit}${road}`
        : `At the roundabout, follow the route${road}`;
    }
    if (maneuver.type === "merge") {
      return `Merge${maneuver.modifier ? ` ${maneuver.modifier}` : ""}${road}`;
    }
    if (maneuver.type === "fork") {
      return `At the fork, keep ${maneuver.modifier || "following the route"}${road}`;
    }
    if (maneuver.type === "turn" || maneuver.type === "end of road") {
      return `${turns[maneuver.modifier] || "Continue"}${road}`;
    }
    if (maneuver.type === "continue" || maneuver.type === "new name") {
      return `Continue${road || " straight"}`;
    }
    return `Continue along the route${road}`;
  }

  function formatStepDistance(distance) {
    if (!Number.isFinite(distance) || distance <= 0) {
      return "";
    }
    return distance >= 1000
      ? `${(distance / 1000).toFixed(1)} km`
      : `${Math.round(distance)} m`;
  }

  function renderRouteSteps(route) {
    const steps = Array.isArray(route.legs)
      ? route.legs.flatMap((leg) => Array.isArray(leg.steps) ? leg.steps : [])
      : [];
    const savedSteps = steps.filter((step) => step && typeof step === "object").map((step) => ({
      instruction: formatStep(step),
      distance: formatStepDistance(step.distance),
    }));

    routeSteps.replaceChildren();
    if (savedSteps.length === 0) {
      const item = document.createElement("li");
      item.textContent = "Turn-by-turn steps are unavailable for this route.";
      routeSteps.append(item);
      return savedSteps;
    }

    savedSteps.forEach((step) => {
      const item = document.createElement("li");
      const instruction = document.createElement("span");
      instruction.className = "step-instruction";
      instruction.textContent = step.instruction;
      item.append(instruction);
      if (step.distance) {
        const distance = document.createElement("span");
        distance.className = "step-distance";
        distance.textContent = step.distance;
        item.append(distance);
      }
      routeSteps.append(item);
    });
    return savedSteps;
  }

  function showRoute(origin, destination, route, queries) {
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
    const duration = Math.max(
      1,
      Math.round((route.distance / 1000 / WALKING_SPEED_KMH) * 60),
    );
    const steps = renderRouteSteps(route);
    document.querySelector("#route-summary").textContent =
      `${origin.label} to ${destination.label}`;
    document.querySelector("#route-distance").textContent = `${distance} km`;
    document.querySelector("#route-duration").textContent = `~${duration} min`;

    currentRoute = {
      origin: origin.label,
      destination: destination.label,
      distance,
      duration,
      originQuery: queries.origin,
      destinationQuery: queries.destination,
      originWasCurrentLocation: !queries.origin,
      steps,
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

  function setRouteButton(label, disabled) {
    submitButton.disabled = disabled;
    submitButton.querySelector(".button-label").textContent = label;
  }

  function clearPreviousRoute() {
    currentRoute = undefined;
    result.hidden = true;
    startTripButton.hidden = true;
    mapHint.hidden = false;
    if (routeLayer && map) {
      map.removeLayer(routeLayer);
      routeLayer = undefined;
    }
  }

  async function requestRoute(origin, destination, queries) {
    loading.hidden = false;
    setRouteButton("Finding walking directions…", true);
    setStatus("Getting walking directions from the public routing service…");
    try {
      await ensureMap();
      const route = await requestWalkingRoute(origin, destination);
      showRoute(origin, destination, route, queries);
      if (queries.origin && queries.destination) {
        saveRecentSearch(queries.origin, queries.destination);
      }
      setStatus("Route ready. Check local conditions before you set off.");
    } catch (error) {
      setStatus(
        error.message || "Couldn't get walking directions. Please try again.",
        true,
      );
    } finally {
      loading.hidden = true;
      setRouteButton("Show walking route", false);
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

    clearPreviousRoute();
    pendingPlaces = undefined;
    placeChoices.hidden = true;
    loading.hidden = false;
    setRouteButton("Searching places…", true);
    setStatus("Searching the public place service…");
    try {
      const usedCurrentLocation = Boolean(currentOrigin);
      const [originMatches, destinationMatches] = await Promise.all([
        usedCurrentLocation ? Promise.resolve([currentOrigin]) : geocode(originQuery),
        geocode(destinationQuery),
      ]);
      pendingPlaces = {
        origin: originMatches,
        destination: destinationMatches,
        originIndex: originMatches.length === 1 ? 0 : null,
        destinationIndex: destinationMatches.length === 1 ? 0 : null,
        queries: {
          origin: usedCurrentLocation ? "" : originQuery,
          destination: destinationQuery,
        },
      };

      if (renderPlaceChoices(pendingPlaces)) {
        loading.hidden = true;
        setRouteButton("Select matching places above", true);
        setStatus("Choose the matching starting point and destination to continue.");
        return;
      }

      const selected = pendingPlaces;
      pendingPlaces = undefined;
      await requestRoute(
        selected.origin[selected.originIndex],
        selected.destination[selected.destinationIndex],
        selected.queries,
      );
    } catch (error) {
      setStatus(
        error.message || "Couldn't search for places. Please try again.",
        true,
      );
      loading.hidden = true;
      setRouteButton("Show walking route", false);
    }
  }

  function selectPlace(event) {
    const radio = event.target;
    if (!(radio instanceof HTMLInputElement) || !pendingPlaces) {
      return;
    }
    const selectedIndex = Number(radio.value);
    if (!Number.isInteger(selectedIndex)) {
      return;
    }

    if (radio.name === "origin-place") {
      pendingPlaces.originIndex = selectedIndex;
    } else if (radio.name === "destination-place") {
      pendingPlaces.destinationIndex = selectedIndex;
    } else {
      return;
    }

    placeChoices.querySelectorAll(".place-choice").forEach((choice) => {
      choice.classList.toggle(
        "selected",
        choice.querySelector("input").checked,
      );
    });

    if (
      pendingPlaces.originIndex !== null &&
      pendingPlaces.destinationIndex !== null
    ) {
      const selected = pendingPlaces;
      pendingPlaces = undefined;
      placeChoices.hidden = true;
      void requestRoute(
        selected.origin[selected.originIndex],
        selected.destination[selected.destinationIndex],
        selected.queries,
      );
    }
  }

  function editCurrentRoute() {
    if (!currentRoute) {
      return;
    }
    originInput.value = currentRoute.originWasCurrentLocation
      ? ""
      : (currentRoute.originQuery || currentRoute.origin);
    destinationInput.value = currentRoute.destinationQuery;
    currentOrigin = undefined;
    clearPreviousRoute();
    setStatus(
      originInput.value
        ? "Route places restored. Edit either place and submit to get updated directions."
        : "Destination restored. Press “Use my current location” to set the starting point again.",
    );
    originInput.focus();
  }

  function restoreSavedRouteForEditing() {
    if (new URLSearchParams(window.location.search).get("editTrip") !== "1") {
      return;
    }
    const trip = utils.getItem(utils.keys.activeTrip, null);
    if (!trip || typeof trip.destination !== "string") {
      setStatus("No saved route was found. Enter places to plan a new walk.");
      return;
    }

    const wasCurrentLocation =
      trip.originWasCurrentLocation ||
      trip.origin === "Your current location";
    originInput.value = wasCurrentLocation
      ? ""
      : (typeof trip.originQuery === "string" && trip.originQuery) || trip.origin;
    destinationInput.value =
      (typeof trip.destinationQuery === "string" && trip.destinationQuery) ||
      trip.destination;
    setStatus(
      originInput.value
        ? "Refreshing the saved route. You can edit either place while planning."
        : "Destination restored. Press “Use my current location” to set the starting point again.",
    );
    originInput.focus();
    if (originInput.value) {
      form.requestSubmit();
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
  placeChoices.addEventListener("change", selectPlace);
  form.addEventListener("submit", planRoute);
  locationButton.addEventListener("click", useCurrentLocation);
  shareButton.addEventListener("click", shareCurrentRoute);
  startTripButton.addEventListener("click", startTrip);
  editRouteButton.addEventListener("click", editCurrentRoute);
  document.querySelector("#clear-recents").addEventListener("click", () => {
    if (utils.removeItem(utils.keys.recentSearches)) {
      renderRecentSearches();
      utils.showToast("Recent places cleared.", "success");
    }
  });

  renderRecentSearches();
  restoreSavedRouteForEditing();
  initializeMapOnDemand();
})();
