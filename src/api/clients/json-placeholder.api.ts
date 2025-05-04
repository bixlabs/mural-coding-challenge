import ky from 'ky';

// Mock API to augment recipient data (name, email, address, etc.) for demo purposes
const JSON_PLACEHOLDER_API_URL = 'https://jsonplaceholder.typicode.com';

export const jsonPlaceholderApi = ky.create({
	prefixUrl: JSON_PLACEHOLDER_API_URL,
});

export type ListJsonPlaceholderUsersRes = {
	id: number;
	name: string;
	username: string;
	email: string;
	address: {
		street: string;
		suite: string;
		city: string;
		zipcode: string;
		geo: {
			lat: string;
			lng: string;
		};
	};
	phone: string;
	website: string;
	company: {
		name: string;
		catchPhrase: string;
		bs: string;
	};
}[];

export async function listJsonPlaceholderUsers(): Promise<ListJsonPlaceholderUsersRes> {
	try {
		return await jsonPlaceholderApi.get('users').json();
	} catch (error) {
		console.error('Error fetching JSON Placeholder users:', error);
		throw error;
	}
}
