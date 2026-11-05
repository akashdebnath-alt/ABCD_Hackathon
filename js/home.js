(function () {
  "use strict";

  const utils = window.SafeWalkUtils;
  const trip = utils.getItem(utils.keys.activeTrip, null);
  const savedTrip = document.querySelector("#home-saved-trip");

  if (
    trip &&
    typeof trip.origin === "string" &&
    typeof trip.destination === "string"
  ) {
    document.querySelector("#home-trip-route").textContent =
      `${utils.sanitizeText(trip.origin)} to ${utils.sanitizeText(trip.destination)}`;
    savedTrip.hidden = false;
  }
})();
