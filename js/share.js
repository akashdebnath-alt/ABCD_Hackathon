function getLocation(cb) {
  if (!navigator.geolocation) return cb(CENTER);
  navigator.geolocation.getCurrentPosition(
    p => cb([p.coords.latitude, p.coords.longitude]),
    () => cb(CENTER)   // fallback so the demo never breaks
  );
}

function whatsapp(text) {
  window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
}

function shareLocation() {
  getLocation(loc => whatsapp(
    "I'm walking home. Track me here: https://maps.google.com/?q=" + loc[0] + "," + loc[1]));
}

function sendSOS() {
  getLocation(loc => whatsapp(
    "🚨 SOS! I need help. My location: https://maps.google.com/?q=" + loc[0] + "," + loc[1]));
}