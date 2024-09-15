// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	// interface Locals {}
	// interface PageData {}
	// interface Error {}
	// interface Platform {}
}

import type { Database } from '$lib/db/types/supabase.types';
//#region Supabase
import type { SupabaseClient, Session, User } from '@supabase/supabase-js';

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient;
			safeGetSession(): Promise<{ session: Session | null; user: User | null }>;
		}
		interface PageData {
			supabase: SupabaseClient<Database>;
			session: Session | null;
			user: User | null;
		}
		// interface Error {}
		// interface Platform {}
	}
	
	type InputElementEvent = Event & {
		currentTarget: EventTarget & HTMLInputElement;
	};

	type SelectElementEvent = Event & {
		currentTarget: EventTarget & HTMLSelectElement;
	};
}
//#endregion
