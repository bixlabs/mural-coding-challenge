import { createAccount } from '@/api/services/account.api';
import { useAccountStore } from '@/stores/useAccountStore';
import { CreateAccountRes } from '@/types/account';
import { useMutation } from '@tanstack/react-query';

export function useCreateAccount() {
	const { setAccountId, setAccountBalances } = useAccountStore();

	const mutation = useMutation({
		mutationFn: createAccount,
		onSuccess: (createAccountResponse: CreateAccountRes) => {
			setAccountId(createAccountResponse.id);
			setAccountBalances(createAccountResponse.accountDetails.balances);
		},
	});

	return {
		...mutation,
		createAccount: mutation.mutate,
	};
}
