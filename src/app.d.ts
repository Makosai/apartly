// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	// interface Locals {}
	// interface PageData {}
	// interface Error {}
	// interface Platform {}
}

import type Listing from '$components/formats/Listing.svelte';
import type { Database } from '$lib/db/types/supabase.types';
//#region Supabase
import type { SupabaseClient, Session, User } from '@supabase/supabase-js';

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient<Database>;
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

	type FormElementEvent = Event & {
		currentTarget: EventTarget & HTMLFormElement;
	};

	type InputElementEvent = Event & {
		currentTarget: EventTarget & HTMLInputElement;
	};

	type SelectElementEvent = Event & {
		currentTarget: EventTarget & HTMLSelectElement;
	};

	type NearbyListingData = {
		id: number;
		owner_id: string;
		title: string;
		description: string;
		sq_footage: number;
		rooms: number;
		monthly_price: number;
		lat: number;
		long: number;
		location_label: string;
	}

	type ListingData = {
		id: number;
		owner_id: string;
		title: string;
		description: string;
		sq_footage: number;
		rooms: number;
		monthly_price: number;
		location: unknown;
		location_label: string;
	};
}
//#endregion
