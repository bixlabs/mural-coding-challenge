import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAccountStore } from '@/stores/useAccountStore';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export default function HomePage() {
	const { accountId, accountBalances, clearAccount } = useAccountStore();
	const navigate = useNavigate();

	useEffect(() => {
		if (accountId) return;

		navigate('/accounts/create');
	}, [accountId, navigate]);

	function handleClearAccount() {
		clearAccount();
		navigate('/accounts/create');
	}

	return (
		<div className="w-full max-w-xl mx-auto px-4 flex justify-center">
			<Card className="w-full max-w-md shadow-md">
				<CardHeader>
					<CardTitle className="text-2xl">Account Summary</CardTitle>
					<CardDescription>Here are your current account details.</CardDescription>
				</CardHeader>

				<CardContent className="space-y-6">
					<div>
						<p className="text-sm text-muted-foreground mb-1">Account ID</p>
						<p className="text-lg font-mono">{accountId ?? 'Not set'}</p>
					</div>

					<div>
						<p className="text-sm text-muted-foreground mb-1">Balances</p>
						{accountBalances?.length ? (
							<ul className="space-y-1">
								{accountBalances.map((balance) => (
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
				</CardContent>

				<CardFooter>
					<Button variant="destructive" className="ml-auto" data-testid="clear-account" onClick={handleClearAccount}>
						Clear Account
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
