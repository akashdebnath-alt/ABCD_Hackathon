(function () {
  "use strict";

  const utils = window.SafeWalkUtils;
  const alertMessage = document.querySelector("#alert-message");
  const shareAlertButton = document.querySelector("#share-alert");
  const status = document.querySelector("#safety-status");
  const fakeCallOverlay = document.querySelector("#fake-call-overlay");
  const coverOverlay = document.querySelector("#cover-overlay");
  const callerNameInput = document.querySelector("#caller-name");
  const contactForm = document.querySelector("#contact-form");
  let selectedPersona = "Trusted contact";

  function setStatus(message, isError) {
    status.textContent = message;
    status.classList.toggle("error", Boolean(isError));
  }

  function formatPhone(phone) {
    return phone.replace(/[^\d+]/g, "");
  }

  function renderContact() {
    const contact = utils.getItem(utils.keys.trustedContact, null);
    const savedContact = document.querySelector("#saved-contact");
    if (
      !contact ||
      typeof contact.name !== "string" ||
      typeof contact.phone !== "string"
    ) {
      savedContact.hidden = true;
      return;
    }

    document.querySelector("#saved-contact-name").textContent =
      utils.sanitizeText(contact.name, 60);
    document.querySelector("#saved-contact-number").textContent =
      utils.sanitizeText(contact.phone, 24);
    document.querySelector("#call-contact").href =
      `tel:${formatPhone(contact.phone)}`;
    savedContact.hidden = false;
  }

  function saveContact(event) {
    event.preventDefault();
    const name = utils.sanitizeText(document.querySelector("#contact-name").value, 60);
    const phone = utils.sanitizeText(document.querySelector("#contact-phone").value, 24);
    const normalized = formatPhone(phone);
    const digitCount = normalized.replace(/\D/g, "").length;

    if (!name || digitCount < 7 || digitCount > 15 || !/^\+?[\d\s().-]+$/.test(phone)) {
      setStatus("Enter a contact name and a valid phone number (7–15 digits).", true);
      return;
    }

    if (utils.setItem(utils.keys.trustedContact, { name, phone })) {
      selectedPersona = name;
      callerNameInput.value = name;
      renderContact();
      setStatus("Trusted contact saved on this browser only.");
    }
  }

  function removeContact() {
    if (utils.removeItem(utils.keys.trustedContact)) {
      document.querySelector("#contact-name").value = "";
      document.querySelector("#contact-phone").value = "";
      renderContact();
      setStatus("Saved trusted contact removed from this browser.");
    }
  }

  function shareAlertWithLocation() {
    if (!navigator.geolocation) {
      setStatus("Location isn't supported by this browser. Call 112 or share a message without location.", true);
      return;
    }

    shareAlertButton.disabled = true;
    setStatus("Waiting for location permission…");
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const latitude = coords.latitude.toFixed(5);
        const longitude = coords.longitude.toFixed(5);
        const mapUrl = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`;
        const contact = utils.getItem(utils.keys.trustedContact, null);
        const contactNote =
          contact && typeof contact.name === "string"
            ? ` Please contact ${utils.sanitizeText(contact.name, 60)}.`
            : "";
        const message = `${utils.sanitizeText(alertMessage.value, 500) || "I need help. Please contact me."}${contactNote}\nMy current location: ${mapUrl}`;

        try {
          const method = await window.SafeWalkShare.shareText(message);
          const messages = {
            shared: "Share sheet opened. Choose a trusted recipient and send the alert.",
            copied: "Alert copied. Paste it into your chosen app and send it to a trusted person.",
            prompted: "Alert shown for you to copy and send to someone you trust.",
            cancelled: "Sharing cancelled; no alert message was sent.",
          };
          setStatus(messages[method]);
        } catch (error) {
          setStatus(`Couldn't prepare alert: ${error.message}`, true);
        } finally {
          shareAlertButton.disabled = false;
        }
      },
      (error) => {
        const messages = {
          1: "Location permission was denied. Call 112 if you need emergency help.",
          2: "Your location couldn't be determined. Call 112 if you need emergency help.",
          3: "Location request timed out. Try again or call 112 if needed.",
        };
        shareAlertButton.disabled = false;
        setStatus(messages[error.code] || "Couldn't access your location.", true);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    );
  }

  function showFakeCall() {
    selectedPersona =
      utils.sanitizeText(callerNameInput.value, 60) || "Trusted contact";
    document.querySelector("#call-title").textContent = selectedPersona;
    fakeCallOverlay.hidden = false;
    document.querySelector("#close-fake-call").focus();
  }

  function hideFakeCall() {
    fakeCallOverlay.hidden = true;
    document.querySelector("#fake-call").focus();
  }

  function showCover() {
    coverOverlay.hidden = false;
    document.querySelector("#uncover-screen").focus();
  }

  function hideCover() {
    coverOverlay.hidden = true;
    document.querySelector("#cloak-screen").focus();
  }

  contactForm.addEventListener("submit", saveContact);
  document.querySelector("#remove-contact").addEventListener("click", removeContact);
  shareAlertButton.addEventListener("click", shareAlertWithLocation);
  document.querySelector("#fake-call").addEventListener("click", showFakeCall);
  document.querySelector("#close-fake-call").addEventListener("click", hideFakeCall);
  document.querySelector("#cloak-screen").addEventListener("click", showCover);
  document.querySelector("#uncover-screen").addEventListener("click", hideCover);
  document.addEventListener("keydown", (event) => {
    const activeOverlay = !fakeCallOverlay.hidden
      ? fakeCallOverlay
      : !coverOverlay.hidden
        ? coverOverlay
        : null;
    if (event.key === "Tab" && activeOverlay) {
      const focusable = [...activeOverlay.querySelectorAll("button, a[href], input")]
        .filter((element) => !element.disabled && element.getClientRects().length);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
      return;
    }

    if (event.key === "Escape") {
      if (!fakeCallOverlay.hidden) {
        hideFakeCall();
      } else if (!coverOverlay.hidden) {
        hideCover();
      }
    }
  });

  const savedContact = utils.getItem(utils.keys.trustedContact, null);
  if (savedContact && typeof savedContact.name === "string") {
    document.querySelector("#contact-name").value =
      utils.sanitizeText(savedContact.name, 60);
    document.querySelector("#contact-phone").value =
      utils.sanitizeText(savedContact.phone, 24);
    callerNameInput.value = utils.sanitizeText(savedContact.name, 60);
    selectedPersona = utils.sanitizeText(savedContact.name, 60);
  }
  renderContact();
})();
