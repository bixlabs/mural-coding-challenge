import { executePayoutRequest as executePayoutRequestApi } from '@/api/services/payout.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useExecutePayoutRequest() {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: (payoutRequestId: string) => executePayoutRequestApi(payoutRequestId),
	});

	function executePayoutRequest(
		payoutRequestId: string,
		options?: {
			onSuccess?: () => void;
			onError?: (error: Error) => void;
		}
	) {
		mutation.mutate(payoutRequestId, {
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['payoutRequests'] });
				options?.onSuccess?.();
			},
			onError: (error) => {
				options?.onError?.(error);
			},
		});
	}

	return {
		...mutation,
		executePayoutRequest,
	};
}
