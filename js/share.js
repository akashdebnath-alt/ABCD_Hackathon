(function () {
  "use strict";
  const i18n = window.SafeWalkI18n;

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
        window.SafeWalkUtils.showToast(i18n.t("Message copied. Paste it into your chosen app."), "success");
        return "copied";
      } catch {
        return window.prompt(i18n.t("Copy this SafeWalk message:"), text) === null
          ? "cancelled"
          : "prompted";
      }
    }

    return window.prompt(i18n.t("Copy this SafeWalk message:"), text) === null
      ? "cancelled"
      : "prompted";
  }

  async function shareRoute(route) {
    const text = [
      i18n.t("My SafeWalk route:"),
      i18n.routeTitle(route.origin, route.destination),
      `(${i18n.distance(route.distance)}, ${i18n.duration(route.duration)} ${i18n.t("estimated at 4.8 km/h")}).`,
      i18n.t("Demo route only; check local conditions."),
    ].join(" ");
    return shareText(text);
  }

  window.SafeWalkShare = { shareRoute, shareText };
})();
