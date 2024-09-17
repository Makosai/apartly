export const load = async ({ url }) => {
	const acct_type = url.searchParams.get('as');

	return { acct_type };
};
