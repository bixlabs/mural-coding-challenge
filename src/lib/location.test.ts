import { findClosestByIndex, getDistanceKm } from '@/lib/location.util';
import { describe, expect, it } from 'vitest';

const MONTEVIDEO_COORDS = { lat: -34.8384, lon: -56.0308 };
const MIAMI_COORDS = { lat: 25.7959, lon: -80.287 };
const BUENOS_AIRES_COORDS = { lat: -34.8222, lon: -58.5358 };
const COLOMBIA_COORDS = { lat: 4.7016, lon: -74.1469 };

describe('getDistanceKm', () => {
	it('should return 0 when the points are the same', () => {
		// Arrange
		const point1 = MONTEVIDEO_COORDS;
		const point2 = MONTEVIDEO_COORDS;

		// Act
		const distance = getDistanceKm(point1, point2);

		// Assert
		expect(distance).toBe(0);
	});

	it('should return the same distance for both directions', () => {
		// Arrange
		const point1 = MONTEVIDEO_COORDS;
		const point2 = MIAMI_COORDS;

		// Act
		const distance1 = getDistanceKm(point1, point2);
		const distance2 = getDistanceKm(point2, point1);

		// Assert
		expect(distance1).toBe(distance2);
	});

	it('should return the approximate distance in km between Montevideo and Miami', () => {
		// Arrange
		const point1 = MONTEVIDEO_COORDS;
		const point2 = MIAMI_COORDS;
		const expectedDistance = 7200;
		const tolerance = 300;

		// Act
		const distance = getDistanceKm(point1, point2);

		// Assert
		expect(Math.abs(distance - expectedDistance)).toBeLessThanOrEqual(tolerance);
	});
});

describe('getClosestLocation', () => {
	it('should return the closest location', () => {
		// Arrange
		const point = MONTEVIDEO_COORDS;
		const locations = [MIAMI_COORDS, BUENOS_AIRES_COORDS, COLOMBIA_COORDS];
		const expectedIndex = 1;

		// Act
		const closestIndex = findClosestByIndex(point, locations);

		// Assert
		expect(closestIndex).toEqual(expectedIndex);
	});
});
