import { getAccounts } from '@/api/services/account.api';
import { useQuery } from '@tanstack/react-query';

export function useGetMainAccount() {
	const query = useQuery({
		queryKey: ['accounts'],
		queryFn: getAccounts,
	});

	const mainAccount = query.data?.find((account) => account.name === 'Main Account');

	return {
		...query,
		mainAccount,
	};
}
