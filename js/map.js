(function () {
  "use strict";

  const form = document.querySelector("#route-form");
  const originInput = document.querySelector("#origin");
  const destinationInput = document.querySelector("#destination");
  const locationButton = document.querySelector("#use-location");
  const submitButton = document.querySelector("#plan-route");
  const shareButton = document.querySelector("#share-route");
  const status = document.querySelector("#status");
  const result = document.querySelector("#route-result");
  const mapHint = document.querySelector(".map-hint");

  let map;
  let zones = [];
  let zoneDataAvailable = false;
  let zonesLoading;
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

  async function geocode(query) {
    const url = new URL("https://photon.komoot.io/api/");
    url.searchParams.set("q", query);
    url.searchParams.set("limit", "1");

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Place search is temporarily unavailable. Please try again.");
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
      throw new Error("Walking directions are temporarily unavailable. Please try again.");
    }

    const data = await response.json();
    if (data.code !== "Ok" || !data.routes || !data.routes[0]) {
      throw new Error("No walking route was found between those places.");
    }

    return data.routes[0];
  }

  function showRoute(origin, destination, route) {
    if (routeLayer) {
      map.removeLayer(routeLayer);
    }

    const line = L.geoJSON(route.geometry, {
      style: { color: "#245c46", weight: 5, opacity: 0.88 },
    });
    const bounds = line.getBounds();
    routeLayer = L.featureGroup([line]);

    [
      { place: origin, color: "#438360", label: "Start" },
      { place: destination, color: "#e18263", label: "Destination" },
    ].forEach(({ place, color, label }) => {
      const marker = L.circleMarker([place.coordinates[1], place.coordinates[0]], {
        radius: 7,
        color: "#fff",
        weight: 3,
        fillColor: color,
        fillOpacity: 1,
      })
        .bindPopup(`${label}: ${place.label}`);
      routeLayer.addLayer(marker);
      bounds.extend(marker.getLatLng());
    });

    routeLayer.addTo(map);
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });

    const distance = (route.distance / 1000).toFixed(1);
    const duration = Math.max(1, Math.round(route.duration / 60));
    document.querySelector("#route-summary").textContent =
      `${origin.label} to ${destination.label}`;
    document.querySelector("#route-meta").textContent =
      `${distance} km · approximately ${duration} min walking`;

    const safetyResult = document.querySelector("#safety-result");
    if (zoneDataAvailable) {
      const score = window.SafeWalkScore.scoreRoute(
        route.geometry.coordinates,
        zones,
      );
      const zoneText = score.nearbyZones.length
        ? `${score.nearbyZones.length} illustrative zone${score.nearbyZones.length === 1 ? "" : "s"} near this route`
        : "No illustrative zones near this route";
      safetyResult.replaceChildren();

      const number = document.createElement("span");
      number.className = "score-number";
      number.textContent = `${score.score}`;
      const description = document.createElement("span");
      description.className = "score-caption";
      description.textContent = `Demo indicator / 100 · ${zoneText}`;
      safetyResult.append(number, description);
    } else {
      safetyResult.textContent = "Demo zone data couldn't be loaded.";
    }

    currentRoute = {
      origin: origin.label,
      destination: destination.label,
      distance,
      duration,
    };
    result.hidden = false;
    mapHint.hidden = true;
  }

  async function planRoute(event) {
    event.preventDefault();
    const originQuery = originInput.value.trim();
    const destinationQuery = destinationInput.value.trim();
    if (!originQuery || !destinationQuery) {
      setStatus("Enter both a starting point and a destination.", true);
      return;
    }

    currentRoute = undefined;
    result.hidden = true;
    submitButton.disabled = true;
    submitButton.textContent = "Finding a walking route…";
    setStatus("Searching for places and walking directions…");
    try {
      const origin = currentOrigin || (await geocode(originQuery));
      const destination = await geocode(destinationQuery);
      await zonesLoading;
      const route = await requestWalkingRoute(origin, destination);
      showRoute(origin, destination, route);
      setStatus("Route ready. Check local conditions before you set off.");
    } catch (error) {
      setStatus(error.message || "Couldn't plan that route. Please try again.", true);
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = 'Show my route <span aria-hidden="true">→</span>';
    }
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setStatus("Location isn't supported by this browser. Enter a place instead.", true);
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
        setStatus("Starting point set to your current location.");
      },
      (error) => {
        const messages = {
          1: "Location permission was denied. You can enter a starting place instead.",
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
      await window.SafeWalkShare.shareRoute(currentRoute);
      setStatus("Route shared.");
    } catch (error) {
      if (error.name !== "AbortError") {
        setStatus(`Couldn't share the route: ${error.message}`, true);
      }
    }
  }

  async function loadZones() {
    try {
      const response = await fetch("data/zones.json");
      if (!response.ok) {
        throw new Error(`Zone data request failed (${response.status}).`);
      }
      const data = await response.json();
      if (
        !Array.isArray(data) ||
        data.some(
          (zone) =>
            !Number.isFinite(zone.lat) ||
            !Number.isFinite(zone.lng) ||
            !Number.isFinite(zone.radiusMeters),
        )
      ) {
        throw new Error("Zone data has an invalid format.");
      }

      zones = data;
      zoneDataAvailable = true;
      zones.forEach((zone) =>
        L.circle([zone.lat, zone.lng], {
          radius: zone.radiusMeters,
          color: "#cf7459",
          weight: 1,
          fillColor: "#e89a7e",
          fillOpacity: 0.24,
        })
          .bindPopup(zone.name)
          .addTo(map),
      );
    } catch (error) {
      setStatus(`Demo zone overlay unavailable: ${error.message}`, true);
    }
  }

  function initialize() {
    if (!window.L) {
      setStatus("The map library didn't load. Check your connection and reload.", true);
      return;
    }

    map = L.map("map").setView([28.6329, 77.2195], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    form.addEventListener("submit", planRoute);
    originInput.addEventListener("input", () => {
      currentOrigin = undefined;
    });
    locationButton.addEventListener("click", useCurrentLocation);
    shareButton.addEventListener("click", shareCurrentRoute);
    zonesLoading = loadZones();
  }

  initialize();
})();
