import { httpClient } from './httpClient';

const MURAL_API_URL = import.meta.env.VITE_MURAL_API_URL ?? 'https://api-staging.muralpay.com';

// WARNING: Exposing API keys in client-side code is insecure and should be avoided in production.
// A secure proxy or backend service should handle authenticated API requests.
// For the purposes of this coding challenge, we include the API key client-side for simplicity.
const MURAL_API_KEY = import.meta.env.VITE_MURAL_API_KEY;
export const MURAL_TRANSFER_API_KEY = import.meta.env.VITE_MURAL_TRANSFER_API_KEY;

export const muralApi = httpClient.extend({
	prefixUrl: `${MURAL_API_URL}/api`,
	headers: {
		Authorization: `Bearer ${MURAL_API_KEY}`,
	},
});

export const makeHeadersWithTransferApiKey = (headers: Record<string, string> = {}) => {
	return {
		...headers,
		'transfer-api-key': MURAL_TRANSFER_API_KEY,
	};
};
