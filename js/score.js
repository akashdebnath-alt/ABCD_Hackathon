(function () {
  "use strict";

  function distanceMeters(a, b) {
    const radians = (degrees) => (degrees * Math.PI) / 180;
    const latitudeDelta = radians(b[1] - a[1]);
    const longitudeDelta = radians(b[0] - a[0]);
    const startLatitude = radians(a[1]);
    const endLatitude = radians(b[1]);
    const haversine =
      Math.sin(latitudeDelta / 2) ** 2 +
      Math.cos(startLatitude) *
        Math.cos(endLatitude) *
        Math.sin(longitudeDelta / 2) ** 2;

    return 6371000 * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
  }

  function scoreRoute(coordinates, zones) {
    const nearbyZones = zones.filter((zone) =>
      coordinates.some(
        (coordinate) =>
          distanceMeters(coordinate, [zone.lng, zone.lat]) <= zone.radiusMeters,
      ),
    );

    return {
      score: Math.max(0, 100 - nearbyZones.length * 25),
      nearbyZones,
    };
  }

  window.SafeWalkScore = { scoreRoute };
})();
