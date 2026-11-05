(function () {
  "use strict";

  const startButton = document.querySelector("#start-tracking");
  const stopButton = document.querySelector("#stop-tracking");
  const shareButton = document.querySelector("#share-location");
  const status = document.querySelector("#tracking-status");
  const coordinates = document.querySelector("#coordinates");
  const accuracy = document.querySelector("#accuracy");
  const lastUpdated = document.querySelector("#last-updated");
  const mapHint = document.querySelector("#tracking-map-hint");

  let map;
  let positionMarker;
  let accuracyCircle;
  let watchId;
  let currentPosition;

  function setStatus(message, isError) {
    status.textContent = message;
    status.classList.toggle("error", Boolean(isError));
  }

  function stopTracking(message, isError) {
    if (watchId !== undefined) {
      navigator.geolocation.clearWatch(watchId);
      watchId = undefined;
    }

    startButton.disabled = false;
    stopButton.disabled = true;
    shareButton.disabled = true;
    setStatus(
      message || "Tracking is off. Your last location remains visible only on this page.",
      isError,
    );
  }

  function updatePosition(position) {
    const { latitude, longitude, accuracy: accuracyMeters } = position.coords;
    const latLng = [latitude, longitude];
    currentPosition = { latitude, longitude };

    if (!positionMarker) {
      positionMarker = L.circleMarker(latLng, {
        radius: 8,
        color: "#fff",
        weight: 3,
        fillColor: "#245c46",
        fillOpacity: 1,
      }).addTo(map);
      accuracyCircle = L.circle(latLng, {
        radius: accuracyMeters,
        color: "#438360",
        weight: 1,
        fillColor: "#438360",
        fillOpacity: 0.12,
      }).addTo(map);
      map.setView(latLng, 16);
    } else {
      positionMarker.setLatLng(latLng);
      accuracyCircle.setLatLng(latLng).setRadius(accuracyMeters);
      map.panTo(latLng);
    }

    coordinates.textContent = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
    accuracy.textContent = `Within ${Math.round(accuracyMeters)} m`;
    lastUpdated.textContent = new Date(position.timestamp).toLocaleTimeString();
    mapHint.hidden = true;
    shareButton.disabled = false;
    setStatus("Live location is updating on this device.");
  }

  function handlePositionError(error) {
    const messages = {
      1: "Location permission was denied. Allow location access in your browser settings, then try again.",
      2: "Your location couldn't be determined. Check your device's location settings and try again.",
      3: "Location request timed out. Keep tracking on to retry, or try again in a moment.",
    };
    shareButton.disabled = true;
    setStatus(messages[error.code] || "Couldn't access your location. Please try again.", true);

    if (error.code === 1) {
      stopTracking(messages[error.code], true);
    }
  }

  function startTracking() {
    if (!window.L) {
      setStatus("The map library didn't load. Check your connection and reload.", true);
      return;
    }
    if (!navigator.geolocation) {
      setStatus("Location isn't supported by this browser. Try a browser with geolocation support.", true);
      return;
    }
    if (!window.isSecureContext) {
      setStatus("Location requires HTTPS or localhost. Open this site from a secure connection.", true);
      return;
    }
    if (watchId !== undefined) {
      return;
    }

    startButton.disabled = true;
    stopButton.disabled = false;
    setStatus("Waiting for your location permission…");
    watchId = navigator.geolocation.watchPosition(
      updatePosition,
      handlePositionError,
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 },
    );
  }

  async function shareLocation() {
    if (!currentPosition) {
      return;
    }

    const { latitude, longitude } = currentPosition;
    const url = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`;
    const text = "My current SafeWalk location";

    try {
      if (navigator.share) {
        await navigator.share({ title: "My current location", text, url });
      } else if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(`${text}: ${url}`);
        setStatus("Location link copied. You can paste it into a message.");
      } else {
        window.prompt("Copy your location link:", url);
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        setStatus(`Couldn't share your location: ${error.message}`, true);
      }
    }
  }

  function initialize() {
    if (!window.L) {
      setStatus("The map library didn't load. Check your connection and reload.", true);
      startButton.disabled = true;
      return;
    }

    map = L.map("tracking-map").setView([28.6329, 77.2195], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    startButton.addEventListener("click", startTracking);
    stopButton.addEventListener("click", () => stopTracking());
    shareButton.addEventListener("click", shareLocation);
    window.addEventListener("pagehide", () => {
      if (watchId !== undefined) {
        navigator.geolocation.clearWatch(watchId);
      }
    });
  }

  initialize();
})();
