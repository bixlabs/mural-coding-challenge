import { listJsonPlaceholderUsers, type ListJsonPlaceholderUsersRes } from '@/api/clients/json-placeholder.api.ts';
import { IndividualRecipient } from '@/types/recipient';

export async function listRecipients(): Promise<IndividualRecipient[]> {
	const recipients = await listJsonPlaceholderUsers();

	return recipients.map(mapToIndividualRecipient);
}

function mapToIndividualRecipient(recipient: ListJsonPlaceholderUsersRes[number]): IndividualRecipient {
	const { address, name, email } = recipient;
	const [firstName, lastName] = name.split(' ');

	return {
		type: 'individual',
		firstName,
		lastName,
		email,
		dateOfBirth: '1990-01-01',
		physicalAddress: {
			address1: `${address.street}, ${address.suite}`,
			address2: '',
			zip: address.zipcode,
			city: address.city,
			state: 'CA',
			country: 'US',
		},
		payoutDetails: {
			bankAccountOwner: name,
			bankName: 'Bank of America',
			fiatAndRailDetails: {
				accountType: 'CHECKING',
				bankAccountNumber: '123456789',
				bankRoutingNumber: '123456789',
				symbol: 'USD',
				type: 'fiat',
			},
			type: 'fiat',
		},
	};
}
