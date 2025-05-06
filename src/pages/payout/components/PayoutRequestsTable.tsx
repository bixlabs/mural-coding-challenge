import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useExecutePayoutRequest } from '@/hooks/useExecutePayoutRequest';
import { useGetAccounts } from '@/hooks/useGetAccounts';
import { useSearchPayoutRequests } from '@/hooks/useSearchPayoutRequests';
import { cn } from '@/lib/utils';
import { PayoutResponseItem, PayoutStatus } from '@/types/payout';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';

const getStatusBadge = (status: PayoutStatus) => {
	const base = 'capitalize';

	switch (status) {
		case 'AWAITING_EXECUTION':
			return (
				<Badge variant="outline" className={cn(base, 'border-blue-500 text-blue-500')}>
					Awaiting
				</Badge>
			);
		case 'CANCELED':
			return (
				<Badge variant="outline" className={cn(base, 'border-yellow-500 text-yellow-500')}>
					Canceled
				</Badge>
			);
		case 'PENDING':
			return (
				<Badge variant="outline" className={cn(base, 'border-blue-500 text-blue-500')}>
					Pending
				</Badge>
			);
		case 'EXECUTED':
			return (
				<Badge variant="outline" className={cn(base, 'border-green-500 text-green-500')}>
					Executed
				</Badge>
			);
		case 'FAILED':
			return (
				<Badge variant="outline" className={cn(base, 'border-red-500 text-red-500')}>
					Failed
				</Badge>
			);
		default:
			return (
				<Badge variant="secondary" className={base}>
					{status}
				</Badge>
			);
	}
};

const formatDate = (dateString: string) => {
	const date = new Date(dateString);
	return new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
	}).format(date);
};

const getPayoutDetails = (payout: PayoutResponseItem) => {
	const details = payout.details;

	if (details.type === 'blockchain') {
		return `${details.blockchain} • ${details.walletAddress.slice(0, 6)}...${details.walletAddress.slice(-4)}`;
	} else {
		return `${details.fiatAmount.fiatAmount} ${details.fiatAmount.fiatCurrencyCode} (${details.fiatAndRailCode})`;
	}
};

export function PayoutRequestsTable() {
	const { payoutRequests, isLoading, isError } = useSearchPayoutRequests();
	const { executePayoutRequest } = useExecutePayoutRequest();
	const [executingPayoutRequestId, setExecutingPayoutRequestId] = useState<string | null>(null);

	const { accounts } = useGetAccounts();

	const getSourceAccount = (sourceAccountId: string) => {
		return accounts?.find((account) => account.id === sourceAccountId)?.name;
	};

	function handleClickExecutePayoutRequest(payoutRequestId: string) {
		setExecutingPayoutRequestId(payoutRequestId);
		executePayoutRequest(payoutRequestId, {
			onSuccess: () => {
				setExecutingPayoutRequestId(null);
				toast.success('Payout request executed successfully');
			},
			onError: (error: Error) => {
				setExecutingPayoutRequestId(null);
				toast.error(error.message);
			},
		});
	}

	if (isLoading) {
		return <div className="text-sm text-muted-foreground">Loading payout requests...</div>;
	}

	if (isError) {
		return <div className="text-sm text-red-500">Failed to load payout requests.</div>;
	}

	return (
		<div className="w-full overflow-x-auto rounded-lg border shadow-sm p-4">
			<Table>
				<TableCaption className="text-muted-foreground">Payout requests and their current statuses</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead className="min-w-[120px] px-4 py-3">Payout ID</TableHead>
						<TableHead className="min-w-[140px] px-4 py-3">Created At</TableHead>
						<TableHead className="px-4 py-3">From</TableHead>
						<TableHead className="px-4 py-3">Status</TableHead>
						<TableHead className="px-4 py-3">Amount Sent</TableHead>
						<TableHead className="px-4 py-3">Type</TableHead>
						<TableHead className="px-4 py-3">Details</TableHead>
						<TableHead className="px-4 py-3 text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{payoutRequests?.pages.map((page) =>
						page.results.map((payoutRequest) => (
							<TableRow key={payoutRequest.id}>
								<TableCell className="font-mono text-sm px-4 py-3">{payoutRequest.id.slice(0, 6)}...</TableCell>
								<TableCell className="text-sm text-muted-foreground px-4 py-3">
									{formatDate(payoutRequest.createdAt)}
								</TableCell>
								<TableCell className="px-4 py-3">{getSourceAccount(payoutRequest.sourceAccountId)}</TableCell>
								<TableCell className="px-4 py-3">{getStatusBadge(payoutRequest.status)}</TableCell>
								<TableCell className="text-sm px-4 py-3">
									{payoutRequest.payouts.length > 0
										? `${payoutRequest.payouts[0].amount.tokenAmount} ${payoutRequest.payouts[0].amount.tokenSymbol}`
										: 'N/A'}
								</TableCell>
								<TableCell className="text-sm capitalize px-4 py-3">
									{payoutRequest.payouts[0]?.details.type || 'N/A'}
								</TableCell>
								<TableCell className="text-sm px-4 py-3">
									{payoutRequest.payouts.length > 0 ? getPayoutDetails(payoutRequest.payouts[0]) : 'N/A'}
								</TableCell>
								<TableCell className="text-right px-4 py-3">
									{payoutRequest.status === 'AWAITING_EXECUTION' && (
										<Button
											variant="default"
											size="sm"
											onClick={() => handleClickExecutePayoutRequest(payoutRequest.id)}
											disabled={!!executingPayoutRequestId}
										>
											{executingPayoutRequestId === payoutRequest.id ? <Loader2 className="animate-spin" /> : 'Execute'}
										</Button>
									)}
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
}
