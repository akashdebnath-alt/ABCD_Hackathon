// SafeWalk live tracking + SOS (works with the Share button on index.html)
(function () {
  let tripId = null;
  let watchId = null;
  let sos = false;

  function trackUrl() {
    const base = location.origin + location.pathname.replace(/[^/]*$/, '');
    return base + 'track.html?id=' + tripId;
  }

  function startWatching() {
    if (watchId !== null) return;
    if (!navigator.geolocation) { alert('Location is not supported on this device.'); return; }
    watchId = navigator.geolocation.watchPosition(
      p => db.ref('trips/' + tripId).set({
        lat: p.coords.latitude,
        lng: p.coords.longitude,
        time: Date.now(),
        sos: sos
      }),
      () => alert('Please allow location access so your contact can see you.'),
      { enableHighAccuracy: true, maximumAge: 2000 }
    );
  }

  function share(message) {
    if (!tripId) tripId = Math.random().toString(36).slice(2, 8);
    // open WhatsApp immediately so the browser does not block the popup
    window.open('https://wa.me/?text=' + encodeURIComponent(message + ' ' + trackUrl()), '_blank');
    startWatching();
  }

  // Take over the Share button (runs before any older handler)
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('#share-route');
    if (!btn) return;
    e.stopImmediatePropagation();
    e.preventDefault();
    share("I'm walking. You can follow my live location here:");
  }, true);

  // Floating SOS button
  const sosBtn = document.createElement('button');
  sosBtn.textContent = '🚨 SOS';
  sosBtn.style.cssText =
    'position:fixed;right:16px;bottom:16px;z-index:9999;background:#c62828;color:#fff;' +
    'border:none;border-radius:999px;padding:16px 22px;font-size:16px;font-weight:bold;' +
    'box-shadow:0 4px 14px rgba(0,0,0,.3);cursor:pointer';
  sosBtn.onclick = function () {
    sos = true;
    share('🚨 SOS! I need help. My live location:');
    db.ref('trips/' + tripId + '/sos').set(true);
  };
  document.body.appendChild(sosBtn);
})();