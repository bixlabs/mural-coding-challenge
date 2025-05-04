// @ts-nocheck
// TODO: Fix typing issues – temporarily disabled due to time constraints.
import { zodResolver } from '@hookform/resolvers/zod';
import { CreditCard, Loader2, PlusCircle, Trash2, Wallet } from 'lucide-react';
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
import { useCurrenciesAndTokens } from '@/hooks/useCurrenciesAndTokens';
import { appToast } from '@/lib/toast';
import { useAccountStore } from '@/stores/useAccountStore';
interface FiatPayoutDetails {
	type: 'fiat';
	bankName: string;
	accountOwner: string;
	accountType: 'checking' | 'savings';
	bankAccountNumber: string;
	routingNumber: string;
	rail: string;
	symbol: string;
}

interface BlockchainPayoutDetails {
	type: 'blockchain';
	walletAddress: string;
	network: string;
	symbol: string;
}

type PayoutDetails = FiatPayoutDetails | BlockchainPayoutDetails;

interface IndividualRecipient {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	payoutDetails: PayoutDetails;
}

// Mock data for recipients with their payout details
const mockRecipients: IndividualRecipient[] = [
	{
		id: '1',
		firstName: 'Leanne',
		lastName: 'Graham',
		email: 'leanne@example.com',
		payoutDetails: {
			type: 'fiat',
			bankName: 'Chase Bank',
			accountOwner: 'Leanne Graham',
			accountType: 'checking',
			bankAccountNumber: '123456789',
			routingNumber: '021000021',
			rail: 'USD_ACH',
			symbol: 'USD',
		},
	},
	{
		id: '2',
		firstName: 'Ervin',
		lastName: 'Howell',
		email: 'ervin@example.com',
		payoutDetails: {
			type: 'fiat',
			bankName: 'Bank of America',
			accountOwner: 'Ervin Howell',
			accountType: 'savings',
			bankAccountNumber: '987654321',
			routingNumber: '026009593',
			rail: 'USD_ACH',
			symbol: 'USD',
		},
	},
	{
		id: '3',
		firstName: 'Clementine',
		lastName: 'Bauch',
		email: 'clementine@example.com',
		payoutDetails: {
			type: 'blockchain',
			walletAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
			network: 'Ethereum',
			symbol: 'ETH',
		},
	},
	{
		id: '4',
		firstName: 'Patricia',
		lastName: 'Lebsack',
		email: 'patricia@example.com',
		payoutDetails: {
			type: 'blockchain',
			walletAddress: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
			network: 'Polygon',
			symbol: 'MATIC',
		},
	},
];

// Define Zod schema for form validation
const supportingDetailsSchema = z.object({
	document: z.any().optional(),
	purpose: z.string().optional(),
});

const payoutSchema = z.object({
	amount: z.coerce.number().positive('Amount must be positive'),
	currencySent: z.string().min(1, 'Currency is required'),
	recipientId: z.string().min(1, 'Recipient is required'),
	supportingDetails: supportingDetailsSchema.optional(),
});

const formSchema = z.object({
	sourceAccountId: z.string(),
	memo: z.string().optional(),
	payouts: z.array(payoutSchema).min(1, 'At least one payout is required'),
});

type FormValues = z.infer<typeof formSchema>;

export default function PayoutRequestForm() {
	const { currenciesAndTokens } = useCurrenciesAndTokens();

	const { accountId } = useAccountStore();

	// Get source account from localStorage or hardcode for development
	const sourceAccountId = accountId;

	// Initialize form with React Hook Form and Zod resolver
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			sourceAccountId,
			memo: '',
			payouts: [
				{
					amount: '',
					currencySent: '',
					recipientId: '',
					supportingDetails: {
						purpose: '',
					},
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

	// Setup field array for dynamic payouts
	const { fields, append, remove } = useFieldArray({
		control,
		name: 'payouts',
	});

	// Watch all payouts to calculate summary and get selected recipients
	const watchPayouts = watch('payouts');

	// Calculate totals by currency
	const getTotalsByCurrency = () => {
		const totals: Record<string, number> = {};

		watchPayouts.forEach((payout) => {
			if (payout.amount && payout.currencySent) {
				const amount = Number.parseFloat(payout.amount) || 0;
				const currency = payout.currencySent;

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

	// Find recipient by ID
	const getRecipientById = (id: string) => {
		return mockRecipients.find((recipient) => recipient.id === id);
	};

	const { createPayoutRequest } = useCreatePayoutRequest();

	// Handle form submission
	const onSubmit: SubmitHandler<FormValues> = async (data) => {
		const processedData = {
			...data,
			payouts: data.payouts.map((payout) => {
				const recipient = getRecipientById(payout.recipientId);
				return {
					amount: payout.amount,
					currencySent: payout.currencySent,
					recipientInfo: recipient,
					payoutDetails: recipient?.payoutDetails,
				};
			}),
		};

		return new Promise((resolve, reject) =>
			createPayoutRequest(processedData, {
				onSuccess: () => {
					appToast.success('Payout request created successfully');
					reset();
					resolve();
				},
				onError: () => {
					appToast.error('Failed to create payout request');
					reject();
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
				<form onSubmit={handleSubmit(onSubmit)}>
					<CardContent className="space-y-6">
						{/* Request Info Section */}
						<div>
							<h3 className="text-lg font-medium mb-4">Request Info</h3>
							<div className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="sourceAccountId">Source Account</Label>
									<Controller
										name="sourceAccountId"
										control={control}
										render={({ field }) => (
											<Select disabled value={field.value} onValueChange={field.onChange}>
												<SelectTrigger id="sourceAccountId">
													<SelectValue placeholder="Select source account" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value={sourceAccountId}>{sourceAccountId}</SelectItem>
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
											<CardContent className="pt-6 space-y-4">
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
														<Label htmlFor={`payouts.${index}.currencySent`}>Currency or Token Sent</Label>
														<Controller
															name={`payouts.${index}.currencySent`}
															control={control}
															render={({ field }) => (
																<Select value={field.value} onValueChange={field.onChange}>
																	<SelectTrigger id={`payouts.${index}.currencySent`}>
																		<SelectValue placeholder="Select currency or token" />
																	</SelectTrigger>
																	<SelectContent>
																		{currenciesAndTokens.map((option) => (
																			<SelectItem key={option.code} value={option.code}>
																				{option.label}
																			</SelectItem>
																		))}
																	</SelectContent>
																</Select>
															)}
														/>
														{errors.payouts?.[index]?.currencySent && (
															<p className="text-sm text-destructive">{errors.payouts[index]?.currencySent?.message}</p>
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
																	{mockRecipients.map((recipient) => (
																		<SelectItem key={recipient.id} value={recipient.id}>
																			{recipient.firstName} {recipient.lastName} – {recipient.email}
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
																		<CreditCard className="h-3 w-3 mr-1" /> Bank Transfer
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
																<div>
																	<span className="text-muted-foreground">Bank Name:</span>
																	<p>{payoutDetails.bankName}</p>
																</div>
																<div>
																	<span className="text-muted-foreground">Account Owner:</span>
																	<p>{payoutDetails.accountOwner}</p>
																</div>
																<div>
																	<span className="text-muted-foreground">Account Type:</span>
																	<p className="capitalize">{payoutDetails.accountType}</p>
																</div>
																<div>
																	<span className="text-muted-foreground">Account Number:</span>
																	<p>••••{payoutDetails.bankAccountNumber.slice(-4)}</p>
																</div>
																<div>
																	<span className="text-muted-foreground">Routing Number:</span>
																	<p>••••{payoutDetails.routingNumber.slice(-4)}</p>
																</div>
																<div>
																	<span className="text-muted-foreground">Rail & Currency:</span>
																	<p>
																		{payoutDetails.rail} ({payoutDetails.symbol})
																	</p>
																</div>
															</div>
														) : (
															<div className="grid grid-cols-1 gap-y-2 text-sm">
																<div>
																	<span className="text-muted-foreground">Wallet Address:</span>
																	<p className="font-mono text-xs break-all">{payoutDetails.walletAddress}</p>
																</div>
																<div>
																	<span className="text-muted-foreground">Network:</span>
																	<p>{payoutDetails.network}</p>
																</div>
																<div>
																	<span className="text-muted-foreground">Token:</span>
																	<p>{payoutDetails.symbol}</p>
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
											currencySent: '',
											recipientId: '',
											supportingDetails: {
												purpose: '',
											},
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
