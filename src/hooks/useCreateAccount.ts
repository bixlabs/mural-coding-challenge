import { createAccount } from '@/api/services/account.api';
import { useAccountStore } from '@/stores/useAccountStore';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';

export function useCreateAccount() {
	const mutation = useMutation({
		mutationFn: createAccount,
	});

	const { setLastCreatedAccount } = useAccountStore();
	useEffect(() => {
		if (!mutation.data) return;

		setLastCreatedAccount(mutation.data);
	}, [mutation.data, setLastCreatedAccount]);

	return {
		...mutation,
		createAccount: mutation.mutate,
	};
}
