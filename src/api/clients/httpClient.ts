import ky from 'ky';

export const httpClient = ky.create({
	hooks: {
		afterResponse: [
			async (_request, _options, response) => {
				if (!response.ok) {
					const errorBody = await response.clone().json();
					throw new Error(errorBody.message);
				}

				return response;
			},
		],
	},
});
