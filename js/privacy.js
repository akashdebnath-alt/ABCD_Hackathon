(function () {
  "use strict";

  document.querySelector("#clear-data").addEventListener("click", () => {
    if (!window.confirm("Clear SafeWalk trip details, recent searches, saved contact, and onboarding preference from this browser?")) {
      return;
    }

    if (window.SafeWalkUtils.clearSafeWalkData()) {
      window.SafeWalkUtils.showToast("SafeWalk data cleared from this browser.", "success");
    }
  });
})();
