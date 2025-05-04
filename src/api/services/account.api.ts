import { muralApi } from '@/api/clients/mural.api';
import { CreateAccountReq, CreateAccountRes } from '@/types/account';

export async function createAccount(payload: CreateAccountReq): Promise<CreateAccountRes> {
	try {
		return await muralApi
			.post('accounts', {
				json: payload,
			})
			.json();
	} catch (error) {
		console.error('Error creating account:', error);
		throw error;
	}
}
