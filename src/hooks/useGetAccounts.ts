import { getAccounts } from '@/api/services/account.api';
import { useQuery } from '@tanstack/react-query';

export function useGetAccounts() {
	const query = useQuery({ queryKey: ['accounts'], queryFn: getAccounts });

	return {
		...query,
		accounts: query.data,
	};
}
