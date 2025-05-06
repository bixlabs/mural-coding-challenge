/**
 * NOTE: The list of recipients in this file is hardcoded for simplicity and due to time constraints.
 * Ideally, the recipients should be dynamically generated and managed by the user,
 * for example by fetching a list of user-created contacts from a backend or database.
 * This approach is only intended for coding challenges purposes.
 */
import { getIpGeolocationInfo } from '@/api/clients/ip.api';
import { getDistanceKm } from '@/lib/location.util';
import { useQuery } from '@tanstack/react-query';

const CURRENCY_LOCATIONS = Object.freeze({
	USD: { geoPoint: { lat: 33.6407, lon: -84.4277 } },
	EUR: { geoPoint: { lat: 49.0097, lon: 2.5479 } },
	COP: { geoPoint: { lat: 4.7014, lon: -74.1469 } },
	MXN: { geoPoint: { lat: 19.4363, lon: -99.0721 } },
	BRL: { geoPoint: { lat: -23.4356, lon: -46.4731 } },
	CLP: { geoPoint: { lat: -33.3928, lon: -70.7856 } },
	PEN: { geoPoint: { lat: -12.0219, lon: -77.1144 } },
	BOB: { geoPoint: { lat: -17.644, lon: -63.1351 } },
	CRC: { geoPoint: { lat: 9.9939, lon: -84.2088 } },
	ZAR: { geoPoint: { lat: -26.1337, lon: 28.2426 } },
	ARS: { geoPoint: { lat: -34.8222, lon: -58.5358 } },
});

const RECIPIENTS = Object.freeze([
	{
		id: '1',
		firstName: 'Alice',
		lastName: 'Smith',
		email: 'alice@example.com',
		payoutDetails: {
			type: 'fiat',
			bankName: 'Chase Bank',
			bankAccountOwner: 'Alice Smith',
			fiatAndRailDetails: {
				type: 'usd',
				symbol: 'USD',
				accountType: 'CHECKING',
				bankAccountNumber: '123456789',
				bankRoutingNumber: '021000021',
			},
		},
	},
	{
		id: '2',
		firstName: 'Carlos',
		lastName: 'Gomez',
		email: 'carlos@example.com',
		payoutDetails: {
			type: 'fiat',
			bankName: 'Bancolombia',
			bankAccountOwner: 'Carlos Gomez',
			fiatAndRailDetails: {
				type: 'cop',
				symbol: 'COP',
				phoneNumber: '+573001112233',
				accountType: 'SAVINGS',
				bankAccountNumber: '987654321',
				documentNumber: '1234567890',
				documentType: 'NATIONAL_ID',
			},
		},
	},
	{
		id: '3',
		firstName: 'Ana',
		lastName: 'Martinez',
		email: 'ana@example.com',
		payoutDetails: {
			type: 'fiat',
			bankName: 'Banco Nación',
			bankAccountOwner: 'Ana Martinez',
			fiatAndRailDetails: {
				type: 'ars',
				symbol: 'ARS',
				bankAccountNumber: '2850590940090418135201',
				documentNumber: '20-30111222-5',
				bankAccountNumberType: 'CBU',
			},
		},
	},
	{
		id: '4',
		firstName: 'Sophie',
		lastName: 'Durand',
		email: 'sophie@example.com',
		payoutDetails: {
			type: 'fiat',
			bankName: 'BNP Paribas',
			bankAccountOwner: 'Sophie Durand',
			fiatAndRailDetails: {
				type: 'eur',
				symbol: 'EUR',
				iban: 'FR7630006000011234567890189',
				swiftBic: 'AGRIFRPP',
				country: 'FR',
			},
		},
	},
	{
		id: '5',
		firstName: 'Diego',
		lastName: 'Hernandez',
		email: 'diego@example.com',
		payoutDetails: {
			type: 'fiat',
			bankName: 'BBVA México',
			bankAccountOwner: 'Diego Hernandez',
			fiatAndRailDetails: {
				type: 'mxn',
				symbol: 'MXN',
				bankAccountNumber: '002010077777777771',
			},
		},
	},
	{
		id: '6',
		firstName: 'Julia',
		lastName: 'Silva',
		email: 'julia@example.com',
		payoutDetails: {
			type: 'fiat',
			bankName: 'Banco ItauBank S.A.',
			bankAccountOwner: 'Julia Silva',
			fiatAndRailDetails: {
				type: 'brl',
				symbol: 'BRL',
				pixAccountType: 'EMAIL',
				pixEmail: 'julia@example.com',
				pixPhone: '+5511999999999',
				branchCode: '1234',
				documentNumber: '12345678901',
			},
		},
	},
	{
		id: '7',
		firstName: 'Mateo',
		lastName: 'Rojas',
		email: 'mateo@example.com',
		payoutDetails: {
			type: 'fiat',
			bankName: 'Banco del Estado de Chile',
			bankAccountOwner: 'Mateo Rojas',
			fiatAndRailDetails: {
				type: 'clp',
				symbol: 'CLP',
				accountType: 'CHECKING',
				bankAccountNumber: '000123456789',
				documentType: 'NATIONAL_ID',
				documentNumber: '987654321',
			},
		},
	},
	{
		id: '8',
		firstName: 'Lucia',
		lastName: 'Vargas',
		email: 'lucia@example.com',
		payoutDetails: {
			type: 'fiat',
			bankName: 'Banco Central de Reserva',
			bankAccountOwner: 'Lucia Vargas',
			fiatAndRailDetails: {
				type: 'pen',
				symbol: 'PEN',
				documentNumber: '1234567890',
				documentType: 'NATIONAL_ID',
				bankAccountNumber: '12345678901234567890',
				accountType: 'SAVINGS',
			},
		},
	},
	{
		id: '9',
		firstName: 'Marco',
		lastName: 'Quispe',
		email: 'marco@example.com',
		payoutDetails: {
			type: 'fiat',
			bankName: 'Banco Unión',
			bankAccountOwner: 'Marco Quispe',
			fiatAndRailDetails: {
				type: 'bob',
				symbol: 'BOB',
				bankAccountNumber: '3456789012',
				documentNumber: '45678901',
				documentType: 'NATIONAL_ID',
			},
		},
	},
	{
		id: '10',
		firstName: 'Sofia',
		lastName: 'Fernandez',
		email: 'sofia@example.com',
		payoutDetails: {
			type: 'fiat',
			bankName: 'Banco de Costa Rica',
			bankAccountOwner: 'Sofia Fernandez',
			fiatAndRailDetails: {
				type: 'crc',
				symbol: 'CRC',
				iban: 'CR05015202001026284066',
				documentNumber: '123456789',
				documentType: 'NATIONAL_ID',
				bankAccountNumber: '15202001026284066',
			},
		},
	},
	{
		id: '11',
		firstName: 'Thabo',
		lastName: 'Nkosi',
		email: 'thabo@example.com',
		payoutDetails: {
			type: 'fiat',
			bankName: 'FNB',
			bankAccountOwner: 'Thabo Nkosi',
			fiatAndRailDetails: {
				type: 'zar',
				symbol: 'ZAR',
				accountType: 'SAVINGS',
				bankAccountNumber: '9988776655',
			},
		},
	},
	{
		id: '12',
		firstName: 'Ethan',
		lastName: 'Brown',
		email: 'ethan@example.com',
		payoutDetails: {
			type: 'blockchain',
			walletDetails: {
				walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
				blockchain: 'POLYGON',
			},
		},
	},
]);

export function useListRecipients() {
	const { data } = useQuery({
		queryKey: ['ipInfo'],
		queryFn: getIpGeolocationInfo,
		staleTime: 1000 * 60 * 10,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
	});

	if (!data) {
		return {
			recipients: RECIPIENTS,
		};
	}

	const { lat, lon } = data;
	const currentLocation = { lat, lon };

	const recipients = sortRecipientsByDistance(RECIPIENTS, currentLocation);

	return { recipients };
}

/**
 * This function sorts an array of recipients based on their distance from a given location,
 * ensuring that the closest recipients are returned at the beginning of the array.
 * The distance is determined using the geographical points associated with the currency
 * of each recipient's payout details. Recipients with undefined currency codes are not
 * considered in the sorting.
 */
function sortRecipientsByDistance(recipients: typeof RECIPIENTS, currentLocation: { lat: number; lon: number }) {
	return [...recipients].sort((a, b) => {
		const aCurrencyCode = a.payoutDetails.fiatAndRailDetails?.symbol as keyof typeof CURRENCY_LOCATIONS;
		const bCurrencyCode = b.payoutDetails.fiatAndRailDetails?.symbol as keyof typeof CURRENCY_LOCATIONS;

		if (!aCurrencyCode || !bCurrencyCode) {
			return 0;
		}

		const aGeoPoint = CURRENCY_LOCATIONS[aCurrencyCode];
		const bGeoPoint = CURRENCY_LOCATIONS[bCurrencyCode];

		const aDistance = getDistanceKm(currentLocation, aGeoPoint.geoPoint);
		const bDistance = getDistanceKm(currentLocation, bGeoPoint.geoPoint);
		return aDistance - bDistance;
	});
}
