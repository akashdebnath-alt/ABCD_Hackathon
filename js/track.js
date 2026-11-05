(function () {
  "use strict";

  const utils = window.SafeWalkUtils;
  const tripDetails = document.querySelector("#trip-details");
  const noTrip = document.querySelector("#no-trip");
  const status = document.querySelector("#track-status");
  const shareTripButton = document.querySelector("#share-trip");
  const stopTripButton = document.querySelector("#stop-trip");
  const shareLocationButton = document.querySelector("#share-location");
  const tripSteps = document.querySelector("#trip-steps");
  let trip;

  function setStatus(message, isError) {
    status.textContent = message;
    status.classList.toggle("error", Boolean(isError));
  }

  function loadTrip() {
    trip = utils.getItem(utils.keys.activeTrip, null);
    if (
      !trip ||
      typeof trip.origin !== "string" ||
      typeof trip.destination !== "string"
    ) {
      noTrip.hidden = false;
      tripDetails.hidden = true;
      return;
    }

    document.querySelector("#trip-route").textContent =
      `${utils.sanitizeText(trip.origin)} to ${utils.sanitizeText(trip.destination)}`;
    document.querySelector("#trip-distance").textContent =
      `${utils.sanitizeText(trip.distance, 20)} km`;
    document.querySelector("#trip-duration").textContent =
      `~${utils.sanitizeText(trip.duration, 20)} min`;
    const startedAt = new Date(trip.startedAt);
    document.querySelector("#trip-time").textContent =
      Number.isNaN(startedAt.valueOf())
        ? "Trip planned in this browser"
        : `Planned ${startedAt.toLocaleString()}`;
    tripSteps.replaceChildren();
    const steps = Array.isArray(trip.steps) ? trip.steps : [];
    if (steps.length === 0) {
      const item = document.createElement("li");
      item.textContent = "Turn-by-turn directions are unavailable for this saved trip.";
      tripSteps.append(item);
    } else {
      steps.forEach((step) => {
        if (!step || typeof step.instruction !== "string") {
          return;
        }
        const item = document.createElement("li");
        const instruction = document.createElement("span");
        instruction.className = "step-instruction";
        instruction.textContent = step.instruction;
        item.append(instruction);
        if (typeof step.distance === "string" && step.distance) {
          const distance = document.createElement("span");
          distance.className = "step-distance";
          distance.textContent = step.distance;
          item.append(distance);
        }
        tripSteps.append(item);
      });
      if (tripSteps.childElementCount === 0) {
        const item = document.createElement("li");
        item.textContent = "Turn-by-turn directions are unavailable for this saved trip.";
        tripSteps.append(item);
      }
    }
    tripDetails.hidden = false;
    noTrip.hidden = true;
  }

  async function shareTrip() {
    if (!trip) {
      return;
    }

    try {
      const method = await window.SafeWalkShare.shareRoute(trip);
      const messages = {
        shared: "Share sheet opened. Choose a recipient to send trip details.",
        copied: "Trip details copied. Paste them into a message to your chosen recipient.",
        prompted: "Trip details shown for you to copy and share.",
        cancelled: "Sharing cancelled; no message was sent.",
      };
      setStatus(messages[method]);
    } catch (error) {
      setStatus(`Couldn't share trip details: ${error.message}`, true);
    }
  }

  function endTrip() {
    if (utils.removeItem(utils.keys.activeTrip)) {
      trip = null;
      tripDetails.hidden = true;
      noTrip.hidden = false;
      setStatus("Trip details were removed from this browser.");
    }
  }

  function shareCurrentLocation() {
    if (!navigator.geolocation) {
      setStatus("Location isn't supported by this browser. You can share trip details instead.", true);
      return;
    }

    shareLocationButton.disabled = true;
    setStatus("Waiting for location permission…");
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const latitude = coords.latitude.toFixed(5);
        const longitude = coords.longitude.toFixed(5);
        const mapUrl = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`;
        try {
          const method = await window.SafeWalkShare.shareText(
            `My current location (shared once at my request): ${mapUrl}`,
          );
          const messages = {
            shared: "Share sheet opened. Choose a recipient to send this one-time location link.",
            copied: "One-time location link copied. Paste it into a message to your chosen recipient.",
            prompted: "One-time location link shown for you to copy and share.",
            cancelled: "Sharing cancelled; no location message was sent.",
          };
          setStatus(messages[method]);
        } catch (error) {
          setStatus(`Couldn't share location: ${error.message}`, true);
        } finally {
          shareLocationButton.disabled = false;
        }
      },
      (error) => {
        const messages = {
          1: "Location permission was denied. You can choose to share trip details instead.",
          2: "Your location couldn't be determined. Try again or share trip details.",
          3: "Location request timed out. Try again or share trip details.",
        };
        shareLocationButton.disabled = false;
        setStatus(messages[error.code] || "Couldn't access your location.", true);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    );
  }

  shareTripButton.addEventListener("click", shareTrip);
  stopTripButton.addEventListener("click", endTrip);
  shareLocationButton.addEventListener("click", shareCurrentLocation);
  loadTrip();
})();
