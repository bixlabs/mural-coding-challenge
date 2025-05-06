import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetMainAccount } from '@/hooks/useGetMainAccount';

export default function HomePage() {
	const { mainAccount, isLoading, isError } = useGetMainAccount();

	if (isError) {
		return <div>Error loading account</div>;
	}

	return (
		<div className="w-full max-w-xl mx-auto px-4 flex justify-center">
			<Card className="w-full max-w-md shadow-md">
				<CardHeader>
					<CardTitle className="text-2xl">Account Summary</CardTitle>
					<CardDescription>Here are your main account details.</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					{isLoading ? (
						<div className="text-sm text-muted-foreground">Loading account...</div>
					) : (
						<>
							<div>
								<p className="text-sm text-muted-foreground mb-1">Account ID</p>
								<p className="text-lg font-mono">{mainAccount?.id}</p>
							</div>

							<div>
								<p className="text-sm text-muted-foreground mb-1">Account Name</p>
								<p className="text-lg font-medium">{mainAccount?.name}</p>
							</div>

							<div>
								<p className="text-sm text-muted-foreground mb-1">Balances</p>
								{mainAccount?.accountDetails.balances?.length ? (
									<ul className="space-y-1">
										{mainAccount.accountDetails.balances.map((balance) => (
											<li key={balance.tokenSymbol} className="flex justify-between border-b py-1 text-sm">
												<span>{balance.tokenSymbol}</span>
												<span>
													{Intl.NumberFormat('en-US', {
														style: 'currency',
														currency: 'USD',
													}).format(Number(balance.tokenAmount))}
												</span>
											</li>
										))}
									</ul>
								) : (
									<p className="text-muted-foreground text-sm italic">No balances available.</p>
								)}
							</div>
						</>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
