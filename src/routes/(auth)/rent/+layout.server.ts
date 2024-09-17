import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from '../../$types';

export const load: LayoutServerLoad = async ({ locals: { safeGetSession } }) => {
	const { session, user } = await safeGetSession();

	if (user) {
		if (!Object.keys(user.user_metadata).includes('account_type')) {
			redirect(303, '/');
		}

		switch (user.user_metadata.account_type) {
			case 'realtor':
				return redirect(303, '/realtor');
			case 'none':
				return redirect(303, '/');
		}
	} else {
		redirect(303, '/signin');
	}

	return {
		session,
		user
	};
};
