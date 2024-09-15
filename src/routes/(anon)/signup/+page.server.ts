import { redirect } from '@sveltejs/kit';

export const load = async ({ locals: { safeGetSession } }) => {
	const { user } = await safeGetSession();

	if (user) {
		if (!Object.keys(user.user_metadata).includes('account_type')) {
			redirect(303, '/');
		}

		switch (user.user_metadata.account_type) {
			case 'realtor':
				return redirect(303, '/realtor');
			case 'user':
				return redirect(303, '/user');
			case 'none':
			default:
				return redirect(303, '/');
		}
	}

	return { user };
};
