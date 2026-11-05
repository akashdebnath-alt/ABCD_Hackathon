const CENTER = [28.4595, 77.0266];   // CHANGE to your venue

// Mock zones around the centre. Values are 0-10 (higher = safer).
const ZONES = [
  { dLat: -0.003, dLng: -0.003, light: 3, crowd: 2, police: 2 },
  { dLat:  0.000, dLng:  0.000, light: 3, crowd: 3, police: 3 },
  { dLat:  0.003, dLng:  0.003, light: 4, crowd: 3, police: 2 },
  { dLat: -0.003, dLng:  0.003, light: 8, crowd: 8, police: 7 },
  { dLat:  0.000, dLng:  0.004, light: 9, crowd: 9, police: 8 },
  { dLat:  0.004, dLng:  0.004, light: 9, crowd: 8, police: 9 },
].map(z => ({ ...z, lat: CENTER[0] + z.dLat, lng: CENTER[1] + z.dLng }));

let reports = [];   // unsafe spots reported by users

function timeFactor() {
  const h = new Date().getHours();
  return (h >= 6 && h < 19) ? 10 : 4;   // night is riskier
}

function calculateScore(coords) {
  let total = 0;
  coords.forEach(p => {
    let nearest = null, best = 0.002;
    ZONES.forEach(z => {
      const d = Math.hypot(z.lat - p[0], z.lng - p[1]);
      if (d < best) { best = d; nearest = z; }
    });
    const z = nearest || { light: 5, crowd: 5, police: 5 };
    const nearReports = reports.filter(r => Math.hypot(r[0]-p[0], r[1]-p[1]) < 0.0015).length;
    const s = 0.3*z.light + 0.25*z.crowd + 0.2*z.police
            + 0.15*timeFactor() - 0.1*Math.min(nearReports, 3)*10/3;
    total += s / 0.9;
  });
  return Math.max(0, Math.min(10, total / coords.length)).toFixed(1);
}