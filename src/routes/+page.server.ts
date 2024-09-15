import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const load = async ({ locals: { safeGetSession } }) => {
	const { session, user } = await safeGetSession();

	// TODO: https://github.com/supabase/auth-js/issues/873
	// if (!session || !user) {
	// 	redirect(303, '/');
	// }

	return { session, user };
};

export const actions: Actions = {
	signout: async ({ locals: { supabase, safeGetSession } }) => {
		const { user } = await safeGetSession();
		if (user) {
			await supabase.auth.signOut();
			redirect(303, '/');
		}
	},
};
