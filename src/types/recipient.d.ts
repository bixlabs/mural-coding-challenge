import type { PhysicalAddress } from './shared';

export type Recipient = IndividualRecipient | BusinessRecipient;

export type FiatAndRailDetails = {
	type: string; // e.g. 'usd'
	symbol: string; // 'USD'
	accountType: 'CHECKING' | 'SAVINGS';
	bankAccountNumber: string;
	bankRoutingNumber: string;
};

export type FiatPayoutDetails = {
	type: 'fiat';
	bankName: string;
	bankAccountOwner: string;
	fiatAndRailDetails: FiatAndRailDetails;
};

export type BlockchainPayoutDetails = {
	type: 'blockchain';
	walletDetails: {
		walletAddress: string;
		blockchain: BlockchainNetwork;
	};
};

export type IndividualRecipient = {
	type: 'individual';
	firstName: string;
	lastName: string;
	email: string;
	dateOfBirth: string; // ISO 8601
	physicalAddress: PhysicalAddress;
	// To simplify, we attach 1-1 payout details to the recipient
} & ({ payoutDetails: FiatPayoutDetails } | { payoutDetails: BlockchainPayoutDetails });
