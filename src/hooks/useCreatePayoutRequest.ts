import { createPayoutRequest } from '@/api/services/payout.api';
import { useMutation } from '@tanstack/react-query';

export function useCreatePayoutRequest() {
	const mutation = useMutation({
		mutationFn: createPayoutRequest,
	});

	return {
		...mutation,
		createPayoutRequest: mutation.mutate,
	};
}
