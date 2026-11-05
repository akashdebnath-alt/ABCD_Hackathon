const map = L.map('map').setView(CENTER, 15);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

const start = [CENTER[0] - 0.004, CENTER[1] - 0.004];
const end   = [CENTER[0] + 0.005, CENTER[1] + 0.005];

// Hardcoded routes for the demo (swap with OSRM later if time allows)
const fastRoute = [start, [CENTER[0]-0.002, CENTER[1]-0.002], CENTER,
                   [CENTER[0]+0.003, CENTER[1]+0.003], end];
const safeRoute = [start, [CENTER[0]-0.003, CENTER[1]+0.003],
                   [CENTER[0]-0.001, CENTER[1]+0.004],
                   [CENTER[0]+0.004, CENTER[1]+0.004], end];

let fastLine, safeLine;
function drawRoutes() {
  if (fastLine) map.removeLayer(fastLine);
  if (safeLine) map.removeLayer(safeLine);
  fastLine = L.polyline(fastRoute, { color: '#d9534f', weight: 6 }).addTo(map);
  safeLine = L.polyline(safeRoute, { color: '#2e9e5b', weight: 6 }).addTo(map);
  document.getElementById('fastScore').textContent = calculateScore(fastRoute);
  document.getElementById('safeScore').textContent = calculateScore(safeRoute);
}
L.marker(start).addTo(map).bindPopup('Start');
L.marker(end).addTo(map).bindPopup('Destination');
drawRoutes();

// Tap map to report an unsafe spot
map.on('click', e => {
  if (!confirm('Report this spot as unsafe?')) return;
  reports.push([e.latlng.lat, e.latlng.lng]);
  L.circle(e.latlng, { color: 'red', radius: 80 }).addTo(map)
    .bindPopup('⚠️ Reported unsafe');
  drawRoutes();
});

// Buttons
document.getElementById('sosBtn').onclick = sendSOS;
document.getElementById('shareBtn').onclick = shareLocation;
document.getElementById('fakeBtn').onclick = () =>
  document.getElementById('fakeCall').classList.remove('hidden');
document.getElementById('endCall').onclick = () =>
  document.getElementById('fakeCall').classList.add('hidden');