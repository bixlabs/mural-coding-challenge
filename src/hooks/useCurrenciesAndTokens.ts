import { getIpGeolocationInfo } from '@/api/clients/ip.api';
import { findClosestByIndex } from '@/lib/location.util';
import { useQuery } from '@tanstack/react-query';

const CURRENCIES_AND_TOKENS = Object.freeze([
	{ code: 'USD', label: 'USD - US Dollar' },
	{ code: 'EUR', label: 'EUR - Euro' },
	{ code: 'USDC', label: 'USDC - USD Coin' },
	{ code: 'USDT', label: 'USDT - Tether' },
	{ code: 'DAI', label: 'DAI - Dai Stablecoin' },
	{ code: 'ETH', label: 'ETH - Ethereum' },
	{ code: 'BTC', label: 'BTC - Bitcoin' },
	{ code: 'ARS', label: 'ARS - Argentine Peso' },
	{ code: 'UYU', label: 'UYU - Uruguayan Peso' },
	{ code: 'BRL', label: 'BRL - Brazilian Real' },
	{ code: 'CLP', label: 'CLP - Chilean Peso' },
	{ code: 'COP', label: 'COP - Colombian Peso' },
	{ code: 'PEN', label: 'PEN - Peruvian Sol' },
	{ code: 'MXN', label: 'MXN - Mexican Peso' },
]);

// Each currency is associated with the coordinates of its country’s primary international airport.
const CURRENCIES_AND_TOKENS_LOCATION = Object.freeze([
	{ code: 'USD', geoPoint: { lat: 25.7959, lon: -80.287 } },
	{ code: 'EUR', geoPoint: { lat: 49.0097, lon: 2.5479 } },
	{ code: 'ARS', geoPoint: { lat: -34.8222, lon: -58.5358 } },
	{ code: 'UYU', geoPoint: { lat: -34.8383, lon: -56.0308 } },
	{ code: 'BRL', geoPoint: { lat: -23.4356, lon: -46.4731 } },
	{ code: 'CLP', geoPoint: { lat: -33.3928, lon: -70.7856 } },
	{ code: 'COP', geoPoint: { lat: 4.7014, lon: -74.1469 } },
	{ code: 'PEN', geoPoint: { lat: -12.0219, lon: -77.1144 } },
	{ code: 'MXN', geoPoint: { lat: 19.4363, lon: -99.0721 } },
]);

export function useCurrenciesAndTokens() {
	const { data } = useQuery({
		queryKey: ['ipInfo'],
		queryFn: getIpGeolocationInfo,
		staleTime: 1000 * 60 * 10,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
	});

	if (!data) {
		return {
			currenciesAndTokens: CURRENCIES_AND_TOKENS,
		};
	}

	const { lat, lon } = data;

	const currentLocation = { lat, lon };
	const closestIndex = findClosestByIndex(
		currentLocation,
		CURRENCIES_AND_TOKENS_LOCATION.map((c) => c.geoPoint)
	);

	const closestCurrencyCode = CURRENCIES_AND_TOKENS_LOCATION[closestIndex].code;
	const closestCurrencyOrToken = CURRENCIES_AND_TOKENS.find((c) => c.code === closestCurrencyCode);

	const currenciesAndTokens = [
		closestCurrencyOrToken,
		...CURRENCIES_AND_TOKENS.filter((c) => c.code !== closestCurrencyOrToken?.code),
	];

	return {
		currenciesAndTokens,
	};
}
