(function () {
  "use strict";

  const utils = window.SafeWalkUtils;
  const onboarding = document.querySelector("#onboarding-dialog");
  const onlineBanner = document.querySelector("#offline-banner");
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const darkMode = window.matchMedia("(prefers-color-scheme: dark)");

  function updateConnectivity() {
    if (!onlineBanner) {
      return;
    }
    onlineBanner.hidden = navigator.onLine;
  }

  function updateThemeColor() {
    if (themeColor) {
      themeColor.content = darkMode.matches ? "#15141d" : "#f5f4fb";
    }
  }

  function setupOnboarding() {
    if (!onboarding || utils.getItem(utils.keys.onboardingSeen, false)) {
      return;
    }

    if (typeof onboarding.showModal === "function") {
      onboarding.showModal();
      onboarding.querySelector("#dismiss-onboarding").focus();
    } else {
      onboarding.hidden = false;
    }
  }

  function dismissOnboarding() {
    utils.setItem(utils.keys.onboardingSeen, true);
    if (typeof onboarding.close === "function" && onboarding.open) {
      onboarding.close();
    } else {
      onboarding.hidden = true;
    }
  }

  window.addEventListener("online", updateConnectivity);
  window.addEventListener("offline", updateConnectivity);
  updateConnectivity();
  updateThemeColor();
  darkMode.addEventListener?.("change", updateThemeColor);
  setupOnboarding();

  onboarding?.querySelector("#dismiss-onboarding").addEventListener(
    "click",
    dismissOnboarding,
  );
  onboarding?.querySelector("#privacy-from-onboarding").addEventListener(
    "click",
    dismissOnboarding,
  );
  onboarding?.addEventListener("cancel", () => {
    utils.setItem(utils.keys.onboardingSeen, true);
  });

  if ("serviceWorker" in navigator && window.location.protocol !== "file:") {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch((error) => {
        utils.showToast(`Offline support couldn't start: ${error.message}`, "error");
      });
    });
  }
})();
