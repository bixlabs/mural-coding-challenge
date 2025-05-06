import { zodResolver } from '@hookform/resolvers/zod';
import { CreditCard, Loader2, PlusCircle, Sparkles, Trash2, Wallet } from 'lucide-react';
import { Controller, useFieldArray, useForm, type SubmitHandler } from 'react-hook-form';
import * as z from 'zod';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useCreatePayoutRequest } from '@/hooks/useCreatePayoutRequest';
import { useGetAccounts } from '@/hooks/useGetAccounts';
import { useGetMainAccount } from '@/hooks/useGetMainAccount';
import { useListRecipients } from '@/hooks/useListRecipients';
import { appToast } from '@/lib/toast';
import { useAccountStore } from '@/stores/useAccountStore';
import { useEffect } from 'react';

const payoutSchema = z.object({
	amount: z
		.string()
		.refine((val) => {
			const num = Number(val);
			return !isNaN(num) && num >= 2;
		}, 'Minimum amount is $2')
		.transform((val) => Number(val)),
	tokenSent: z.string().min(1, 'Token is required'),
	recipientId: z.string().min(1, 'Recipient is required'),
});

const formSchema = z.object({
	sourceAccountId: z.string(),
	memo: z.string().optional(),
	payouts: z.array(payoutSchema).min(1, 'At least one payout is required'),
});

type FormValues = z.input<typeof formSchema>;

export default function PayoutRequestForm() {
	const { lastCreatedAccount } = useAccountStore();
	const { mainAccount } = useGetMainAccount();
	const sourceAccountId = mainAccount?.id;
	const { recipients } = useListRecipients();
	const { accounts } = useGetAccounts();
	const { createPayoutRequest } = useCreatePayoutRequest();

	const form = useForm<FormValues>({
		// @ts-expect-error - FIXME: not enough time to fix this
		resolver: zodResolver(formSchema),
		defaultValues: {
			sourceAccountId,
			memo: '',
			payouts: [
				{
					amount: '',
					tokenSent: 'USDC',
					recipientId: '',
				},
			],
		},
	});

	const {
		control,
		handleSubmit,
		watch,
		reset,
		formState: { errors, isSubmitting },
	} = form;

	// Automatically set the source account ID to the main account ID
	useEffect(() => {
		if (mainAccount?.id) {
			reset((prev) => ({
				...prev,
				sourceAccountId: mainAccount.id,
			}));
		}
	}, [mainAccount, reset]);

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'payouts',
	});

	const watchPayouts = watch('payouts');

	const getRecipientById = (id: string) => {
		return recipients.find((recipient) => recipient.id === id);
	};

	const getTotalsByCurrency = () => {
		const totals: Record<string, number> = {};

		watchPayouts.forEach((payout) => {
			if (payout.amount && payout.tokenSent) {
				const amount = Number(payout.amount);
				const currency = payout.tokenSent;

				if (!totals[currency]) {
					totals[currency] = 0;
				}

				totals[currency] += amount;
			}
		});

		return Object.entries(totals).map(([currency, amount]) => ({
			currency,
			amount: amount.toFixed(2),
		}));
	};

	const onSubmit: SubmitHandler<FormValues> = async (data) => {
		const processedData = {
			sourceAccountId: data.sourceAccountId,
			memo: data.memo ?? '',
			payouts: data.payouts.map((payout) => {
				const recipient = getRecipientById(payout.recipientId);

				return {
					amount: {
						tokenAmount: payout.amount,
						tokenSymbol: payout.tokenSent,
					},
					recipientInfo: {
						type: 'individual',
						firstName: recipient!.firstName,
						lastName: recipient!.lastName,
						email: recipient!.email,
						// Hardcoded recipient information due to time constraints
						dateOfBirth: '2000-05-05',
						physicalAddress: {
							address1: '123 Main St.',
							address2: 'Floor 3',
							country: 'US',
							state: 'TX',
							city: 'Austin',
							zip: '78730',
						},
					},
					payoutDetails: recipient!.payoutDetails,
				};
			}),
		};

		return new Promise((resolve, reject) =>
			// @ts-expect-error - FIXME: not enough time to fix this
			createPayoutRequest(processedData, {
				onSuccess: () => {
					appToast.success('Payout request created successfully');
					reset();
					resolve(void 0);
				},
				onError: (error: Error) => {
					appToast.error(error.message);
					reject(error);
				},
			})
		);
	};

	return (
		<div className="max-w-2xl mx-auto px-4">
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl font-bold">Create Payout Request</CardTitle>
					<CardDescription>Fill in the details below to create a new payout request.</CardDescription>
				</CardHeader>
				{/* @ts-expect-error - FIXME: not enough time to fix this */}
				<form onSubmit={handleSubmit(onSubmit)}>
					<CardContent className="space-y-6">
						<div>
							<div className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="sourceAccountId">Source Account</Label>
									<Controller
										name="sourceAccountId"
										control={control}
										render={({ field }) => (
											<Select value={field.value} onValueChange={field.onChange}>
												<SelectTrigger id="sourceAccountId">
													<SelectValue placeholder="Select source account" />
												</SelectTrigger>
												<SelectContent>
													{accounts?.map((account) => (
														<SelectItem key={account.id} value={account.id}>
															{account.id === mainAccount?.id && (
																<Sparkles className="inline mx-1 h-4 w-4 text-yellow-600" />
															)}
															{account.id === lastCreatedAccount?.id && <span className="inline mx-1">🆕</span>}
															{account.name} - ...{account.id.substring(account.id.length - 6)}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										)}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="memo">Memo (optional)</Label>
									<Controller
										name="memo"
										control={control}
										render={({ field }) => (
											<Textarea id="memo" placeholder="Add a memo for this payout request" {...field} />
										)}
									/>
								</div>
							</div>
						</div>

						<Separator />

						{/* Payouts Section */}
						<div>
							<h3 className="text-lg font-medium mb-4">Payouts</h3>
							<div className="space-y-6">
								{fields.map((field, index) => {
									const selectedRecipientId = watchPayouts[index]?.recipientId;
									const selectedRecipient = selectedRecipientId ? getRecipientById(selectedRecipientId) : null;
									const payoutDetails = selectedRecipient?.payoutDetails;

									return (
										<Card key={field.id} className="border border-muted">
											<CardContent className="space-y-4">
												<div className="flex justify-between items-center">
													<h4 className="font-medium">Payout #{index + 1}</h4>
													{fields.length > 1 && (
														<Button type="button" variant="ghost" size="sm" onClick={() => remove(index)}>
															<Trash2 className="h-4 w-4 mr-1" />
															Remove
														</Button>
													)}
												</div>

												{/* Amount Sent Section */}
												<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
													<div className="space-y-2">
														<Label htmlFor={`payouts.${index}.amount`}>Amount</Label>
														<Controller
															name={`payouts.${index}.amount`}
															control={control}
															render={({ field }) => (
																<Input
																	id={`payouts.${index}.amount`}
																	type="number"
																	placeholder="0.00"
																	step="0.01"
																	min={0}
																	{...field}
																/>
															)}
														/>
														{errors.payouts?.[index]?.amount && (
															<p className="text-sm text-destructive">{errors.payouts[index]?.amount?.message}</p>
														)}
													</div>
													<div className="space-y-2">
														<Label htmlFor={`payouts.${index}.tokenSent`}>Token Sent</Label>
														<Controller
															name={`payouts.${index}.tokenSent`}
															control={control}
															render={() => (
																<Select value="USDC" disabled>
																	<SelectTrigger id={`payouts.${index}.tokenSent`}>
																		<SelectValue placeholder="USDC" />
																	</SelectTrigger>
																	<SelectContent>
																		<SelectItem key="USDC" value="USDC">
																			USDC
																		</SelectItem>
																	</SelectContent>
																</Select>
															)}
														/>
														{errors.payouts?.[index]?.tokenSent && (
															<p className="text-sm text-destructive">{errors.payouts[index]?.tokenSent?.message}</p>
														)}
													</div>
												</div>

												{/* Recipient Section */}
												<div className="space-y-2">
													<Label htmlFor={`payouts.${index}.recipientId`}>Recipient</Label>
													<Controller
														name={`payouts.${index}.recipientId`}
														control={control}
														render={({ field }) => (
															<Select value={field.value} onValueChange={field.onChange}>
																<SelectTrigger id={`payouts.${index}.recipientId`}>
																	<SelectValue placeholder="Select recipient" />
																</SelectTrigger>
																<SelectContent>
																	{recipients.map((recipient) => (
																		<SelectItem key={recipient.id} value={recipient.id}>
																			{recipient.firstName} {recipient.lastName} – {recipient.email} -{' '}
																			{recipient.payoutDetails.fiatAndRailDetails?.type ?? 'POLYGON'}
																		</SelectItem>
																	))}
																</SelectContent>
															</Select>
														)}
													/>
													{errors.payouts?.[index]?.recipientId && (
														<p className="text-sm text-destructive">{errors.payouts[index]?.recipientId?.message}</p>
													)}
												</div>

												{/* Payout Details (Read-only display) */}
												{selectedRecipient && payoutDetails && (
													<div className="mt-4 p-4 bg-muted/30 rounded-lg">
														<div className="flex items-center justify-between mb-3">
															<h5 className="font-medium">Payout Details</h5>
															<Badge variant={payoutDetails.type === 'fiat' ? 'outline' : 'secondary'}>
																{payoutDetails.type === 'fiat' ? (
																	<>
																		<CreditCard className="h-3 w-3 mr-1" /> Fiat
																	</>
																) : (
																	<>
																		<Wallet className="h-3 w-3 mr-1" /> Blockchain
																	</>
																)}
															</Badge>
														</div>

														{payoutDetails.type === 'fiat' ? (
															<div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
																{payoutDetails.bankName && (
																	<div>
																		<span className="text-muted-foreground">Bank Name:</span>
																		<p>{payoutDetails.bankName}</p>
																	</div>
																)}
																{payoutDetails.bankAccountOwner && (
																	<div>
																		<span className="text-muted-foreground">Account Owner:</span>
																		<p>{payoutDetails.bankAccountOwner}</p>
																	</div>
																)}
																{payoutDetails.fiatAndRailDetails?.symbol && (
																	<div>
																		<span className="text-muted-foreground">Currency:</span>
																		<p>{payoutDetails.fiatAndRailDetails.symbol}</p>
																	</div>
																)}
																{payoutDetails.fiatAndRailDetails?.accountType && (
																	<div>
																		<span className="text-muted-foreground">Account Type:</span>
																		<p className="capitalize">{payoutDetails.fiatAndRailDetails.accountType}</p>
																	</div>
																)}
																{payoutDetails.fiatAndRailDetails?.bankAccountNumber && (
																	<div>
																		<span className="text-muted-foreground">Account Number:</span>
																		<p>••••{payoutDetails.fiatAndRailDetails.bankAccountNumber.slice(-4)}</p>
																	</div>
																)}
																{payoutDetails.fiatAndRailDetails?.bankRoutingNumber && (
																	<div>
																		<span className="text-muted-foreground">Routing Number:</span>
																		<p>••••{payoutDetails.fiatAndRailDetails.bankRoutingNumber.slice(-4)}</p>
																	</div>
																)}
																{payoutDetails.fiatAndRailDetails?.documentNumber && (
																	<div>
																		<span className="text-muted-foreground">Document Number:</span>
																		<p>••••{payoutDetails.fiatAndRailDetails.documentNumber.slice(-4)}</p>
																	</div>
																)}
																{payoutDetails.fiatAndRailDetails?.documentType && (
																	<div>
																		<span className="text-muted-foreground">Document Type:</span>
																		<p>{payoutDetails.fiatAndRailDetails.documentType}</p>
																	</div>
																)}
																{payoutDetails.fiatAndRailDetails?.pixEmail && (
																	<div>
																		<span className="text-muted-foreground">PIX Email:</span>
																		<p>{payoutDetails.fiatAndRailDetails.pixEmail}</p>
																	</div>
																)}
																{payoutDetails.fiatAndRailDetails?.iban && (
																	<div>
																		<span className="text-muted-foreground">IBAN:</span>
																		<p>••••{payoutDetails.fiatAndRailDetails.iban.slice(-4)}</p>
																	</div>
																)}
																{payoutDetails.fiatAndRailDetails?.country && (
																	<div>
																		<span className="text-muted-foreground">Country:</span>
																		<p>{payoutDetails.fiatAndRailDetails.country}</p>
																	</div>
																)}
															</div>
														) : (
															<div className="grid grid-cols-1 gap-y-2 text-sm">
																<div>
																	<span className="text-muted-foreground">Wallet Address:</span>
																	<p className="font-mono text-xs break-all">
																		{payoutDetails?.walletDetails?.walletAddress}
																	</p>
																</div>
																<div>
																	<span className="text-muted-foreground">Network:</span>
																	<p>{payoutDetails?.walletDetails?.blockchain}</p>
																</div>
															</div>
														)}
													</div>
												)}
											</CardContent>
										</Card>
									);
								})}

								<Button
									type="button"
									variant="outline"
									onClick={() =>
										append({
											amount: '',
											tokenSent: 'USDC',
											recipientId: '',
										})
									}
									className="w-full"
								>
									<PlusCircle className="h-4 w-4 mr-2" />
									Add Another Payout
								</Button>
							</div>
						</div>

						{/* Summary Card */}
						<Card className="bg-muted/30">
							<CardContent className="pt-6">
								<div className="flex flex-col gap-4">
									<div className="flex justify-between items-center">
										<p className="text-sm text-muted-foreground">Total Payouts</p>
										<p className="text-lg font-medium">{fields.length}</p>
									</div>

									<div>
										<p className="text-sm text-muted-foreground mb-2">Total Amount by Currency</p>
										<div className="space-y-2">
											{getTotalsByCurrency().map(({ currency, amount }) => (
												<div key={currency} className="flex justify-between items-center">
													<p className="font-medium">{currency}</p>
													<p className="font-medium">
														{amount} {currency}
													</p>
												</div>
											))}
										</div>
										{getTotalsByCurrency().length === 0 && (
											<p className="text-sm text-muted-foreground italic">No amounts entered</p>
										)}
									</div>
								</div>
							</CardContent>
						</Card>
					</CardContent>

					<CardFooter className="mt-6">
						<Button type="submit" className="w-full" disabled={isSubmitting}>
							{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Create Payout Request
						</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
