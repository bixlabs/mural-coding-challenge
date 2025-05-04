import { Balance } from '@/types/account';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type AccountState = {
	accountId?: string;
	accountBalances?: Balance[];
	setAccountId: (accountId: string) => void;
	setAccountBalances: (balances: Balance[]) => void;
	clearAccount: () => void;
};

export const useAccountStore = create<AccountState>()(
	devtools(
		persist(
			(set) => ({
				accountId: undefined,
				accountBalances: [],
				setAccountId: (accountId: string) => set(() => ({ accountId })),
				setAccountBalances: (balances: Balance[]) => set(() => ({ accountBalances: balances })),
				clearAccount: () => set(() => ({ accountId: undefined, accountBalances: [] })),
			}),
			{ name: 'account' }
		)
	)
);
