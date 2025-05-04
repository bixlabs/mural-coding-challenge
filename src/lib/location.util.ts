/**
 * Calculates the distance in kilometers between two geographic coordinates using the Haversine formula.
 * Source: https://stackoverflow.com/a/21623206 or similar public implementation.
 */
export function getDistanceKm(point1: { lat: number; lon: number }, point2: { lat: number; lon: number }) {
	const R = 6371; // Earth's radius in km
	const dLat = ((point2.lat - point1.lat) * Math.PI) / 180;
	const dLon = ((point2.lon - point1.lon) * Math.PI) / 180;

	const a =
		Math.sin(dLat / 2) ** 2 +
		Math.cos((point1.lat * Math.PI) / 180) * Math.cos((point2.lat * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	return R * c;
}

/**
 * Finds the index of the closest location to a given point from an array of locations.
 *
 * @example
 * const point = { lat: 40.7128, lon: -74.0060 }; // New York City
 * const locations = [
 *   { lat: 34.0522, lon: -118.2437 }, // Los Angeles
 *   { lat: 41.8781, lon: -87.6298 },  // Chicago
 *   { lat: 29.7604, lon: -95.3698 }   // Houston
 * ];
 * const closestIndex = findClosestByIndex(point, locations);
 * console.log(closestIndex); // Output might be 1, assuming Chicago is closest
 */
export function findClosestByIndex(geoPoint: { lat: number; lon: number }, locations: { lat: number; lon: number }[]) {
	const distances = locations.map((location) => getDistanceKm(geoPoint, location));
	const minDistance = Math.min(...distances);

	return distances.indexOf(minDistance);
}
