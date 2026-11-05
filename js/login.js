(function () {
  "use strict";

  const form = document.querySelector("#login-form");
  const status = document.querySelector("#login-status");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    form.reset();
    status.textContent = "Demo sign-in complete. Opening your home page. No account was verified, and no information was sent or saved.";
    window.setTimeout(() => {
      window.location.assign("home.html");
    }, 500);
  });
})();
