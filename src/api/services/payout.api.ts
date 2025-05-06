import { makeHeadersWithTransferApiKey, muralApi } from '@/api/clients/mural.api';
import {
	CreatePayoutRequestReq,
	CreatePayoutRequestRes,
	ExecutePayoutRequestRes,
	SearchPayoutRequestsReq,
	SearchPayoutRequestsRes,
} from '@/types/payout';

const SEARCH_PAYOUTS_DEFAULT_LIMIT = 10;

export async function createPayoutRequest(payload: CreatePayoutRequestReq): Promise<CreatePayoutRequestRes> {
	try {
		return await muralApi
			.post('payouts/payout', {
				json: payload,
			})
			.json();
	} catch (error) {
		console.error('Error creating payout request:', error);
		throw error;
	}
}

export async function executePayoutRequest(payoutId: string): Promise<ExecutePayoutRequestRes> {
	try {
		return await muralApi
			.post(`payouts/payout/${payoutId}/execute`, {
				headers: makeHeadersWithTransferApiKey(),
			})
			.json();
	} catch (error) {
		console.error('Error executing payout request:', error);
		throw error;
	}
}

export async function searchPayoutRequests(
	payload: SearchPayoutRequestsReq = { limit: SEARCH_PAYOUTS_DEFAULT_LIMIT }
): Promise<SearchPayoutRequestsRes> {
	try {
		return await muralApi
			.post(`payouts/search`, {
				json: payload,
			})
			.json();
	} catch (error) {
		console.error('Error searching payout requests:', error);
		throw error;
	}
}
