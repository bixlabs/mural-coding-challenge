import type { Amount, BlockchainNetwork, FiatCurrencyCode, PhysicalAddress } from './shared';

export type PayoutStatus = 'AWAITING_EXECUTION' | 'CANCELED' | 'PENDING' | 'EXECUTED' | 'FAILED';

// ─── Create Payout (Request) ─────────────────────────────────────────────────

export interface CreatePayoutRequestReq {
	sourceAccountId: string;
	memo: string;
	payouts: CreatePayoutItem[];
}

export interface CreatePayoutItem {
	amount: Amount;
	payoutDetails: CreatePayoutRequestDetails;
	recipientInfo: RecipientInfo;
	supportingDetails?: SupportingDetails;
}

export type CreatePayoutRequestDetails =
	| USDPayoutDetails
	| ARSPayoutDetails
	| EURPayoutDetails
	| MXNPayoutDetails
	| BRLPayoutDetails
	| CLPPayoutDetails
	| PENPayoutDetails
	| BOBPayoutDetails
	| COPPayoutDetails;

export interface USDPayoutDetails {
	type: 'usd';
	symbol: 'USD';
	accountType: 'CHECKING' | 'SAVINGS';
	bankAccountNumber: string;
	bankRoutingNumber: string;
}

// All these details were simplified to only include the type and symbol.
export interface ARSPayoutDetails {
	type: 'ars';
	symbol: 'ARS';
}
export interface EURPayoutDetails {
	type: 'eur';
	symbol: 'EUR';
}
export interface MXNPayoutDetails {
	type: 'mxn';
	symbol: 'MXN';
}
export interface BRLPayoutDetails {
	type: 'brl';
	symbol: 'BRL';
}
export interface CLPPayoutDetails {
	type: 'clp';
	symbol: 'CLP';
}
export interface PENPayoutDetails {
	type: 'pen';
	symbol: 'PEN';
}
export interface BOBPayoutDetails {
	type: 'bob';
	symbol: 'BOB';
}
export interface COPPayoutDetails {
	type: 'cop';
	symbol: 'COP';
}

export interface RecipientInfo {
	type: string;
	firstName: string;
	lastName: string;
	email: string;
	dateOfBirth: Date;
	physicalAddress: PhysicalAddress;
}

export interface SupportingDetails {
	supportingDocument: string;
	payoutPurpose: string;
}

// ─── Create Payout (Response) ─────────────────────────────────────────────────

export interface CreatePayoutRequestRes {
	id: string;
	createdAt: string; // ISO 8601
	updatedAt: string; // ISO 8601
	sourceAccountId: string;
	transactionHash: string;
	memo: string;
	status: PayoutStatus;
	payouts: PayoutResponseItem[];
}

export interface PayoutResponseItem {
	id: string;
	createdAt: string; // ISO 8601
	updatedAt: string; // ISO 8601
	amount: Amount;
	details: ResponsePayoutDetails;
}

export type ResponsePayoutDetails = FiatPayoutDetails | BlockchainPayoutDetails;

export interface FiatPayoutDetails {
	type: 'fiat';
	fiatAndRailCode: FiatCurrencyCode;
	fiatPayoutStatus: FiatPayoutStatus;
	fiatAmount: FiatAmount;
	transactionFee: Amount;
	exchangeFeePercentage: number;
	exchangeRate: number;
	feeTotal: Amount;
}

export interface BlockchainPayoutDetails {
	type: 'blockchain';
	walletAddress: string;
	blockchain: BlockchainNetwork;
	status: PayoutStatus;
}

export interface FiatAmount {
	fiatAmount: number;
	fiatCurrencyCode: string;
}

export interface FiatPayoutStatus {
	type: string;
}

// ─── Execute Payout (Response) ────────────────────────────────────────────────

export type ExecutePayoutRequestRes = CreatePayoutRequestRes;

// ─── Search Payout Requests ───────────────────────────────────────────────────

export interface SearchPayoutRequestsReq {
	limit?: number;
	nextId?: string;
	filter?: {
		type: 'payoutStatus';
		statuses: PayoutStatus[];
	};
}

export interface SearchPayoutRequestsRes {
	total: number;
	nextId: string;
	results: CreatePayoutRequestRes[];
}
