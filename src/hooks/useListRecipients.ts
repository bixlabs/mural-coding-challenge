import { listRecipients } from '@/api/services/recipient.api';
import { useQuery } from '@tanstack/react-query';

export function useListRecipients() {
	const query = useQuery({
		queryKey: ['recipients'],
		queryFn: listRecipients,
	});

	return {
		...query,
		recipients: query.data,
	};
}
