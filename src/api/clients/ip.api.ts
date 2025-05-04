import ky from 'ky';

const IP_API_URL = 'http://ip-api.com/json/';

const ipApi = ky.create({
	prefixUrl: IP_API_URL,
});

export interface IpGeolocationInfoRes {
	status: string;
	country: string;
	countryCode: string;
	region: string;
	regionName: string;
	city: string;
	zip: string;
	lat: number;
	lon: number;
	timezone: string;
	isp: string;
	org: string;
	as: string;
	query: string; // ip address
}

export async function getIpGeolocationInfo(): Promise<IpGeolocationInfoRes> {
	try {
		return await ipApi.get('').json();
	} catch (error) {
		console.error('Error fetching IP info:', error);
		throw error;
	}
}
