(function () {
  "use strict";

  const i18n = window.SafeWalkI18n;

  function getRouteText(container) {
    const title =
      container.querySelector("#route-summary, #trip-route")?.textContent.trim() ||
      i18n.t("Directions");
    const metrics = [...container.querySelectorAll(".metric")].map((metric) => {
      const label = metric.querySelector(".metric-label")?.textContent.trim() || "";
      const value = metric.querySelector("strong")?.textContent.trim() || "";
      return label && value ? `${label}: ${value}` : "";
    }).filter(Boolean);
    const steps = [...container.querySelectorAll(".route-steps > li")]
      .map((step, index) => `${index + 1}. ${step.innerText.trim().replace(/\s*\n\s*/g, " — ")}`);
    const disclaimer = container.querySelector(".disclaimer")?.textContent.trim();

    return [
      title,
      ...metrics,
      "",
      i18n.t("Turn-by-turn directions"),
      ...(steps.length ? steps : [i18n.t("Directions aren't available yet.")]),
      "",
      disclaimer || i18n.t("This route and time estimate are not a safety assessment. Check local conditions and trusted official sources before your walk."),
    ].join("\n");
  }

  function setStatus(message, isError) {
    const status = document.querySelector("#status, #track-status");
    if (status) {
      status.textContent = i18n.t(message);
      status.classList.toggle("error", Boolean(isError));
    }
  }

  async function copyRoute(selector) {
    const container = document.querySelector(selector);
    if (!container || container.hidden) {
      setStatus("Directions aren't available yet.", true);
      return;
    }

    const text = getRouteText(container);
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        setStatus("Copied directions.");
        return;
      } catch {
        const copied = window.prompt(i18n.t("Copy directions"), text);
        setStatus(copied === null ? "Copying directions was cancelled." : "Directions shown for you to copy.", copied === null);
        return;
      }
    }

    const copied = window.prompt(i18n.t("Copy directions"), text);
    setStatus(copied === null ? "Copying directions was cancelled." : "Directions shown for you to copy.", copied === null);
  }

  function printRoute(selector) {
    const container = document.querySelector(selector);
    if (!container || container.hidden) {
      setStatus("Directions aren't available yet.", true);
      return;
    }

    document.body.dataset.printRoute = selector.slice(1);
    window.addEventListener("afterprint", () => {
      delete document.body.dataset.printRoute;
    }, { once: true });
    window.print();
    setStatus("Print dialog opened.");
  }

  document.querySelectorAll("[data-copy-route]").forEach((button) => {
    button.addEventListener("click", () => {
      void copyRoute(button.dataset.copyRoute);
    });
  });
  document.querySelectorAll("[data-print-route]").forEach((button) => {
    button.addEventListener("click", () => printRoute(button.dataset.printRoute));
  });
})();
