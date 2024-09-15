import { PUBLIC_SUPABASE_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { Database } from '$lib/db/types/supabase.types';
import type { LayoutLoad } from './$types';
import { createBrowserClient, createServerClient, isBrowser } from '@supabase/ssr';

export const load: LayoutLoad = async ({ fetch, data, depends }) => {
	depends('supabase:auth');

	const supabase = isBrowser()
		? createBrowserClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_KEY, {
				global: {
					fetch
				}
			})
		: createServerClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_KEY, {
				global: {
					fetch
				},
				cookies: {
					get() {
						return JSON.stringify(data.session);
					}
				}
			});

	/**
	 * It's fine to use `getSession` here, because on the client, `getSession` is
	 * safe, and on the server, it reads `session` from the `LayoutData`, which
	 * safely checked the session using `safeGetSession`.
	 */

	const [sessionResponse, userResponse] = await Promise.all([
		supabase.auth.getSession(),
		supabase.auth.getUser()
	]);

	const session = sessionResponse.data.session;
	const user = userResponse.data.user ?? null;

	return { supabase, session, user };
};
