// src/mocks/handlers.js
import { CreateAccountReq, CreateAccountRes } from '@/types/account';
import {
	CreatePayoutRequestReq,
	CreatePayoutRequestRes,
	ExecutePayoutRequestRes,
	SearchPayoutRequestsReq,
	SearchPayoutRequestsRes,
} from '@/types/payout';
import { http, HttpResponse, PathParams } from 'msw';

export const handlers = [
	// Create Account
	http.post<PathParams, CreateAccountReq, CreateAccountRes, 'https://api-staging.muralpay.com/api/accounts'>(
		'https://api-staging.muralpay.com/api/accounts',
		async ({ request }) => {
			const requestBody = await request.json();
			const { name, description } = requestBody;

			await new Promise((resolve) => setTimeout(resolve, 1000));

			return HttpResponse.json({
				id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
				name,
				description: description ?? '',
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				isApiEnabled: true,
				status: 'ACTIVE',
				accountDetails: {
					walletDetails: {
						blockchain: 'ETHEREUM',
						walletAddress: '0x5Df3c917B8064bD48A3f8F2F54a12A7191c6Cb65',
					},
					balances: [
						{
							tokenAmount: 10000,
							tokenSymbol: 'USDC',
						},
						{
							tokenAmount: 2000,
							tokenSymbol: 'USDT',
						},
						{
							tokenAmount: 55,
							tokenSymbol: 'DAI',
						},
						{
							tokenAmount: 100,
							tokenSymbol: 'EUR',
						},
					],
					depositAccount: {
						id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
						status: 'ACTIVATED',
						currency: 'USD',
						bankBeneficiaryName: 'John Doe',
						bankBeneficiaryAddress: '123 Main St, Springfield, IL',
						bankName: 'First National Bank',
						bankAddress: '456 Market St, New York, NY',
						bankRoutingNumber: '021000021',
						bankAccountNumber: '9876543210',
						paymentRails: ['ACH'],
					},
				},
			});
		}
	),

	// Create Payout Request
	http.post<
		PathParams,
		CreatePayoutRequestReq,
		CreatePayoutRequestRes,
		'https://api-staging.muralpay.com/api/payouts/payout'
	>('https://api-staging.muralpay.com/api/payouts/payout', async ({ request }) => {
		const requestBody = await request.json();
		const { sourceAccountId, memo } = requestBody;

		await new Promise((resolve) => setTimeout(resolve, 1000));

		return HttpResponse.json(
			{
				id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				sourceAccountId,
				transactionHash: '0xabc123def4567890fedcba0987654321abcdef12',
				memo,
				status: 'AWAITING_EXECUTION',
				payouts: [
					{
						id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
						createdAt: '2025-05-03T12:35:14.119Z',
						updatedAt: '2025-05-03T12:35:14.119Z',
						amount: {
							tokenAmount: 10.0,
							tokenSymbol: 'USDC',
						},
						details: {
							type: 'fiat',
							fiatAndRailCode: 'usd',
							fiatPayoutStatus: {
								type: 'created',
							},
							fiatAmount: {
								fiatAmount: 9.31,
								fiatCurrencyCode: 'USD',
							},
							transactionFee: {
								tokenAmount: 0.5,
								tokenSymbol: 'USDC',
							},
							exchangeFeePercentage: 2,
							exchangeRate: 0.98,
							feeTotal: {
								tokenAmount: 0.5,
								tokenSymbol: 'USDC',
							},
						},
					},
				],
			},
			{
				status: 201,
			}
		);
	}),

	// Execute Payout Request
	http.post<
		PathParams,
		undefined,
		ExecutePayoutRequestRes,
		'https://api-staging.muralpay.com/api/payouts/:payoutId/execute'
	>('https://api-staging.muralpay.com/api/payouts/:payoutId/execute', async ({ params }) => {
		const { payoutId } = params as { payoutId: string };

		await new Promise((resolve) => setTimeout(resolve, 1000));

		return HttpResponse.json({
			id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
			createdAt: '2025-05-03T12:35:14.119Z',
			updatedAt: '2025-05-03T12:40:00.000Z',
			sourceAccountId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
			transactionHash: '0xdef456abc7890123fedcba0987654321abcde789',
			memo: 'Payout to contractor',
			status: 'EXECUTED',
			payouts: [
				{
					id: payoutId,
					createdAt: '2025-05-03T12:35:14.119Z',
					updatedAt: '2025-05-03T12:40:00.000Z',
					amount: {
						tokenAmount: 10.0,
						tokenSymbol: 'USDC',
					},
					details: {
						type: 'fiat',
						fiatAndRailCode: 'usd',
						fiatPayoutStatus: {
							type: 'executed',
						},
						fiatAmount: {
							fiatAmount: 9.31,
							fiatCurrencyCode: 'USD',
						},
						transactionFee: {
							tokenAmount: 0.5,
							tokenSymbol: 'USDC',
						},
						exchangeFeePercentage: 2,
						exchangeRate: 0.98,
						feeTotal: {
							tokenAmount: 0.5,
							tokenSymbol: 'USDC',
						},
					},
				},
			],
		});
	}),

	// Search Payout Requests
	http.post<
		{
			limit: string;
			nextId: string;
		},
		SearchPayoutRequestsReq,
		SearchPayoutRequestsRes,
		'https://api-staging.muralpay.com/api/payouts/search'
	>('https://api-staging.muralpay.com/api/payouts/search', async () => {
		await new Promise((resolve) => setTimeout(resolve, 1000));

		return HttpResponse.json({
			total: 3,
			nextId: '',
			results: [
				{
					id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
					createdAt: '2025-05-03T12:35:14.119Z',
					updatedAt: '2025-05-03T12:35:14.119Z',
					sourceAccountId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
					transactionHash: '0xabc321fed6549870fedcba0123456789abc12345',
					memo: 'Payroll payout for April',
					status: 'AWAITING_EXECUTION',
					payouts: [
						{
							id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
							createdAt: '2025-05-03T12:35:14.119Z',
							updatedAt: '2025-05-03T12:35:14.119Z',
							amount: {
								tokenAmount: 10.0,
								tokenSymbol: 'USDC',
							},
							details: {
								type: 'fiat',
								fiatAndRailCode: 'usd',
								fiatPayoutStatus: {
									type: 'created',
								},
								fiatAmount: {
									fiatAmount: 9.31,
									fiatCurrencyCode: 'USD',
								},
								transactionFee: {
									tokenAmount: 0.5,
									tokenSymbol: 'USDC',
								},
								exchangeFeePercentage: 2,
								exchangeRate: 0.98,
								feeTotal: {
									tokenAmount: 0.5,
									tokenSymbol: 'USDC',
								},
							},
						},
					],
				},
				{
					id: 'a2bb66f4-e04e-42db-9213-299a5e3c3bbb',
					createdAt: '2025-04-15T09:00:00.000Z',
					updatedAt: '2025-04-15T09:30:00.000Z',
					sourceAccountId: 'a2bb66f4-e04e-42db-9213-299a5e3c3bbb',
					transactionHash: '0x9def456abc7890123fedcba0987654321abcdef67',
					memo: 'Freelancer payout - March',
					status: 'EXECUTED',
					payouts: [
						{
							id: 'a2bb66f4-e04e-42db-9213-299a5e3c3bbb',
							createdAt: '2025-04-15T09:00:00.000Z',
							updatedAt: '2025-04-15T09:30:00.000Z',
							amount: {
								tokenAmount: 100.0,
								tokenSymbol: 'USDC',
							},
							details: {
								type: 'fiat',
								fiatAndRailCode: 'usd',
								fiatPayoutStatus: {
									type: 'executed',
								},
								fiatAmount: {
									fiatAmount: 97.0,
									fiatCurrencyCode: 'USD',
								},
								transactionFee: {
									tokenAmount: 1.0,
									tokenSymbol: 'USDC',
								},
								exchangeFeePercentage: 2,
								exchangeRate: 0.99,
								feeTotal: {
									tokenAmount: 3.0,
									tokenSymbol: 'USDC',
								},
							},
						},
					],
				},
				{
					id: 'a7be56a4-118a-4978-932a-3b1a7bc4c3cc',
					createdAt: '2025-03-01T14:20:00.000Z',
					updatedAt: '2025-03-01T14:25:00.000Z',
					sourceAccountId: 'a7be56a4-118a-4978-932a-3b1a7bc4c3cc',
					transactionHash: '0xdeadbeefcafebabe1234567890abcdefdeadbeef',
					memo: 'EUR payout attempt',
					status: 'FAILED',
					payouts: [
						{
							id: 'a7be56a4-118a-4978-932a-3b1a7bc4c3cc',
							createdAt: '2025-03-01T14:20:00.000Z',
							updatedAt: '2025-03-01T14:25:00.000Z',
							amount: {
								tokenAmount: 200.0,
								tokenSymbol: 'EUR',
							},
							details: {
								type: 'fiat',
								fiatAndRailCode: 'eur',
								fiatPayoutStatus: {
									type: 'failed',
								},
								fiatAmount: {
									fiatAmount: 190.0,
									fiatCurrencyCode: 'EUR',
								},
								transactionFee: {
									tokenAmount: 2.0,
									tokenSymbol: 'EUR',
								},
								exchangeFeePercentage: 3,
								exchangeRate: 0.95,
								feeTotal: {
									tokenAmount: 10.0,
									tokenSymbol: 'EUR',
								},
							},
						},
					],
				},
				{
					id: '7543b693-8110-41a7-b6c6-fbd32188cd15  ',
					createdAt: '2025-04-30T12:35:00.000Z',
					updatedAt: '2025-05-01T12:35:00.000Z',
					sourceAccountId: '...',
					transactionHash: '0x1234abcd...',
					memo: 'Payout via ETHEREUM',
					status: 'AWAITING_EXECUTION',
					payouts: [
						{
							id: '...',
							createdAt: '2025-04-30T12:35:00.000Z',
							updatedAt: '2025-05-01T12:35:00.000Z',
							amount: {
								tokenAmount: 112.5,
								tokenSymbol: 'USDC',
							},
							details: {
								type: 'blockchain',
								walletAddress: '0xabc123...',
								blockchain: 'ETHEREUM',
								status: 'AWAITING_EXECUTION',
							},
						},
					],
				},
				{
					id: '9529105e-5052-468f-adc6-525d7e2b7d4e',
					createdAt: '2025-04-25T12:35:00.000Z',
					updatedAt: '2025-04-26T12:35:00.000Z',
					sourceAccountId: '...',
					transactionHash: '0xdef456...',
					memo: 'Payout via POLYGON',
					status: 'EXECUTED',
					payouts: [
						{
							id: '...',
							createdAt: '2025-04-25T12:35:00.000Z',
							updatedAt: '2025-04-26T12:35:00.000Z',
							amount: {
								tokenAmount: 85.0,
								tokenSymbol: 'USDT',
							},
							details: {
								type: 'blockchain',
								walletAddress: '0xdef456...',
								blockchain: 'POLYGON',
								status: 'EXECUTED',
							},
						},
					],
				},
				{
					id: '18090ddc-6a82-41df-a04f-259c529539ef',
					createdAt: '2025-04-20T12:35:00.000Z',
					updatedAt: '2025-04-21T12:35:00.000Z',
					sourceAccountId: '...',
					transactionHash: '0x7890abcd...',
					memo: 'Payout via BASE',
					status: 'FAILED',
					payouts: [
						{
							id: '...',
							createdAt: '2025-04-20T12:35:00.000Z',
							updatedAt: '2025-04-21T12:35:00.000Z',
							amount: {
								tokenAmount: 215.0,
								tokenSymbol: 'DAI',
							},
							details: {
								type: 'blockchain',
								walletAddress: '0x7890abcd...',
								blockchain: 'BASE',
								status: 'FAILED',
							},
						},
					],
				},
				{
					id: '6a521d5f-6df3-4fef-b97b-64d1b77709b1',
					createdAt: '2025-04-10T12:35:00.000Z',
					updatedAt: '2025-04-11T12:35:00.000Z',
					sourceAccountId: '...',
					transactionHash: '0xcafe456...',
					memo: 'Payout via CELO',
					status: 'EXECUTED',
					payouts: [
						{
							id: '...',
							createdAt: '2025-04-10T12:35:00.000Z',
							updatedAt: '2025-04-11T12:35:00.000Z',
							amount: {
								tokenAmount: 150.0,
								tokenSymbol: 'cUSD',
							},
							details: {
								type: 'blockchain',
								walletAddress: '0xcafe456...',
								blockchain: 'CELO',
								status: 'EXECUTED',
							},
						},
					],
				},
			],
		});
	}),
];
