import { Account } from '@/types/account';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type AccountState = {
	lastCreatedAccount?: Account;
	setLastCreatedAccount: (lastCreatedAccount: Account) => void;
};

export const useAccountStore = create<AccountState>()(
	devtools(
		persist(
			(set) => ({
				lastCreatedAccount: undefined,
				setLastCreatedAccount: (lastCreatedAccount: Account) => set(() => ({ lastCreatedAccount })),
			}),
			{ name: 'accountStore' }
		)
	)
);
