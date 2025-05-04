import { searchPayoutRequests } from '@/api/services/payout.api';
import { useInfiniteQuery } from '@tanstack/react-query';

export function useSearchPayoutRequests() {
	const query = useInfiniteQuery({
		queryKey: ['payoutRequests'],
		queryFn: ({ pageParam }: { pageParam: string }) => searchPayoutRequests({ nextId: pageParam }),
		getNextPageParam: (lastPage) => lastPage.nextId,
		initialPageParam: '',
		initialData: {
			pages: [],
			pageParams: [],
		},
	});

	return {
		...query,
		payoutRequests: query.data,
	};
}
