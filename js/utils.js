(function () {
  "use strict";

  const keys = {
    activeTrip: "safewalk.activeTrip",
    recentSearches: "safewalk.recentSearches",
    trustedContact: "safewalk.trustedContact",
    safetyChecklist: "safewalk.safetyChecklist",
    language: "safewalk.language",
    onboardingSeen: "safewalk.onboardingSeen",
  };
  let toastTimer;

  function showToast(message, type) {
    const toast = document.querySelector("#app-toast");
    if (!toast) {
      return;
    }

    toast.textContent = message;
    toast.dataset.type = type || "info";
    toast.hidden = false;
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toast.hidden = true;
    }, 5000);
  }

  function getItem(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : JSON.parse(value);
    } catch (error) {
      showToast(`Saved data couldn't be read: ${error.message}`, "error");
      return fallback;
    }
  }

  function setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      showToast(`Your changes couldn't be saved: ${error.message}`, "error");
      return false;
    }
  }

  function removeItem(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      showToast(`Saved data couldn't be removed: ${error.message}`, "error");
      return false;
    }
  }

  function clearSafeWalkData() {
    let failed = false;
    Object.values(keys).forEach((key) => {
      try {
        localStorage.removeItem(key);
      } catch {
        failed = true;
      }
    });

    if (failed) {
      showToast("Some SafeWalk data couldn't be cleared by this browser.", "error");
      return false;
    }
    return true;
  }

  function sanitizeText(value, maxLength) {
    return String(value || "")
      .replace(/[\u0000-\u001f\u007f]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, maxLength || 160);
  }

  window.SafeWalkUtils = {
    keys,
    showToast,
    getItem,
    setItem,
    removeItem,
    clearSafeWalkData,
    sanitizeText,
  };
})();
