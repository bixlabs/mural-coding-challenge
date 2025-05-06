import { makeHeadersWithTransferApiKey, muralApi } from '@/api/clients/mural.api';
import { Account, CreateAccountReq, GetAccountsRes } from '@/types/account';

export async function createAccount(payload: CreateAccountReq): Promise<Account> {
	try {
		return await muralApi
			.post('accounts', {
				json: payload,
				// A Transfer API Key is required to create accounts, even though the account creation endpoint does not explicitly require it in the request headers.
				// For more information, see the note in the docs: https://developers.muralpay.com/docs/get-api-key
				headers: makeHeadersWithTransferApiKey(),
			})
			.json();
	} catch (error) {
		console.error('Error creating account:', error);
		throw error;
	}
}

export async function getAccounts(): Promise<GetAccountsRes> {
	try {
		return await muralApi.get('accounts').json();
	} catch (error) {
		console.error('Error getting accounts:', error);
		throw error;
	}
}
