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

export type CreatePayoutRequestDetails = FiatPayoutDetailsReq | BlockchainPayoutDetails;

export interface FiatPayoutDetailsReq {
	type: 'fiat';
	bankName: string;
	bankAccountOwner: string;
	fiatAndRailDetails:
		| USDPayoutDetails
		| COPPayoutDetails
		| ARSPayoutDetails
		| MXNPayoutDetails
		| BRLPayoutDetails
		| CLPPayoutDetails
		| PENPayoutDetails
		| BOBPayoutDetails
		| CRCPayoutDetails
		| ZARPayoutDetails;
}

export interface USDPayoutDetails {
	type: 'usd';
	symbol: 'USD';
	accountType: 'CHECKING' | 'SAVINGS';
	bankAccountNumber: string;
	bankRoutingNumber: string;
}

export interface COPPayoutDetails {
	type: 'cop';
	symbol: 'COP';
	phoneNumber: string;
	accountType: 'CHECKING' | 'SAVINGS';
	bankAccountNumber: string;
	documentNumber: string;
	documentType: 'NATIONAL_ID' | 'PASSPORT' | 'RESIDENT_ID' | 'RUC';
}

export interface ARSPayoutDetails {
	type: 'ars';
	symbol: 'ARS';
	bankAccountNumber: string;
	documentNumber: string;
	bankAccountNumberType: string;
}

export interface EURPayoutDetails {
	type: 'eur';
	symbol: 'EUR';
	iban: string;
	swiftBic: string;
	country: string;
}
export interface MXNPayoutDetails {
	type: 'mxn';
	symbol: 'MXN';
	bankAccountNumber: string;
}
export interface BRLPayoutDetails {
	type: 'brl';
	symbol: 'BRL';
	pixAccountType: 'PHONE' | 'EMAIL' | 'DOCUMENT' | 'BANK_ACCOUNT';
	pixEmail: string;
	pixPhone: string;
	branchCode: string;
	documentNumber: string;
}
export interface CLPPayoutDetails {
	type: 'clp';
	symbol: 'CLP';
	accountType: 'CHECKING' | 'SAVINGS';
	bankAccountNumber: string;
	documentType: 'NATIONAL_ID' | 'PASSPORT' | 'RESIDENT_ID' | 'RUC';
	documentNumber: string;
}
export interface PENPayoutDetails {
	type: 'pen';
	symbol: 'PEN';
	documentNumber: string;
	documentType: 'NATIONAL_ID' | 'PASSPORT' | 'RESIDENT_ID' | 'RUC';
	bankAccountNumber: string;
	accountType: 'CHECKING' | 'SAVINGS';
}
export interface BOBPayoutDetails {
	type: 'bob';
	symbol: 'BOB';
	bankAccountNumber: string;
	documentNumber: string;
	documentType: 'NATIONAL_ID' | 'PASSPORT' | 'RESIDENT_ID' | 'RUC';
}

export interface CRCPayoutDetails {
	type: 'crc';
	symbol: 'CRC';
	iban: string;
	documentNumber: string;
	documentType: 'NATIONAL_ID' | 'PASSPORT' | 'RESIDENT_ID' | 'RUC';
	bankAccountNumber: string;
}

export interface ZARPayoutDetails {
	type: 'zar';
	symbol: 'ZAR';
	accountType: 'CHECKING' | 'SAVINGS';
	bankAccountNumber: string;
}

export interface BlockchainPayoutDetails {
	type: 'blockchain';
	walletDetails: {
		walletAddress: string;
		blockchain: BlockchainNetwork;
	};
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
