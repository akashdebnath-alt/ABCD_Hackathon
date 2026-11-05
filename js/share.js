(function () {
  "use strict";

  async function shareRoute(route) {
    const text = `My SafeWalk route: ${route.origin} to ${route.destination} (${route.distance} km, about ${route.duration} min). Demo route only; check local conditions.`;

    if (navigator.share) {
      await navigator.share({ title: "My SafeWalk route", text });
      return;
    }

    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      window.alert("Route details copied. You can paste them into a message.");
      return;
    }

    window.prompt("Copy your route details:", text);
  }

  window.SafeWalkShare = { shareRoute };
})();
