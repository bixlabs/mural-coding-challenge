// accounts.ts
import type { Amount, BlockchainNetwork, FiatCurrencyCode } from './shared';

export interface CreateAccountReq {
	name: string;
	description?: string;
}

export type Balance = Amount;

export type CurrencyCode = Uppercase<FiatCurrencyCode>;

export type CreateAccountRes = Account;

export interface Account {
	id: string;
	name: string;
	description: string;
	createdAt: string; // ISO 8601
	updatedAt: string; // ISO 8601
	isApiEnabled: boolean;
	status: 'INITIALIZING' | 'ACTIVE';
	accountDetails: AccountDetails;
}

export interface AccountDetails {
	walletDetails: WalletDetails;
	balances: Balance[];
	depositAccount: DepositAccount;
}

export interface WalletDetails {
	blockchain: BlockchainNetwork;
	walletAddress: string;
}

export interface DepositAccount {
	id: string;
	status: 'ACTIVATED' | 'DEACTIVATED';
	currency: CurrencyCode;
	bankBeneficiaryName: string;
	bankBeneficiaryAddress: string;
	bankName: string;
	bankAddress: string;
	bankRoutingNumber: string;
	bankAccountNumber: string;
	paymentRails: string[];
}

// ─── Get Accounts ───────────────────────────────────────────────────────────

export type GetAccountsRes = Account[];
