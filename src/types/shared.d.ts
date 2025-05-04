export interface Amount {
	tokenAmount: number;
	tokenSymbol: string;
}

export type BlockchainNetwork = 'ETHEREUM' | 'POLYGON' | 'BASE' | 'CELO';

export type FiatCurrencyCode = 'usd' | 'ars' | 'eur' | 'mxn' | 'brl' | 'clp' | 'pen' | 'bob' | 'cop' | 'crc' | 'zar';

export interface PhysicalAddress {
	address1: string;
	address2: string;
	country: string; // ISO 3166-1 alpha-2 country code
	state: string;
	city: string;
	zip: string;
}
