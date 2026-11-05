(function () {
  "use strict";

  async function shareText(text) {
    if (navigator.share) {
      try {
        await navigator.share({ title: "SafeWalk", text });
        return "shared";
      } catch (error) {
        if (error.name === "AbortError") {
          return "cancelled";
        }
        if (error.name !== "NotAllowedError") {
          throw error;
        }
      }
    }

    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        window.SafeWalkUtils.showToast("Message copied. Paste it into your chosen app.", "success");
        return "copied";
      } catch {
        return window.prompt("Copy this SafeWalk message:", text) === null
          ? "cancelled"
          : "prompted";
      }
    }

    return window.prompt("Copy this SafeWalk message:", text) === null
      ? "cancelled"
      : "prompted";
  }

  async function shareRoute(route) {
    const text = `My SafeWalk route: ${route.origin} to ${route.destination} (${route.distance} km, about ${route.duration} min). Demo route only; check local conditions.`;
    return shareText(text);
  }

  window.SafeWalkShare = { shareRoute, shareText };
})();
