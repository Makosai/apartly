import { json, error } from '@sveltejs/kit';

export async function GET({ locals: { supabase } }) {
	const { data: apartments, error: err } = await supabase.from('apartments').select('*').limit(100);

	if (err) {
		return error(500, err.message);
	}

	if (!apartments) {
		return error(404, 'no apartments found');
	}

	return json(apartments);
}

export async function POST({ request, locals: { supabase } }) {
	const {
		min_sq_footage,
		max_sq_footage,
		min_rooms,
		max_rooms,
		min_price,
		max_price,
		location,
		start,
		end,
		limit
	} = await request.json();

	let query;

	if (location && location.lat && location.long) {
		query = supabase.rpc('nearby_apartments', { lat: location.lat, long: location.long });

		if (location.max_meters) {
			query.lte('dist_meters', location.max_meters);
		}
	} else {
		query = supabase.from('apartments').select('*');
	}

  if (min_sq_footage) {
    query.gte('sq_footage', min_sq_footage);
  }

  if (max_sq_footage) {
    query.lte('sq_footage', max_sq_footage);
  }

  if (min_rooms) {
		query.gte('rooms', min_rooms);
	}

	if (max_rooms) {
		query.lte('rooms', max_rooms);
	}

	if (min_price) {
		query.gte('monthly_price', min_price);
	}

	if (max_price) {
		query.lte('monthly_price', max_price);
	}

	if (start && end) {
		query.range(start, end);
	}

	if (limit && limit > 100) {
		return error(400, 'limit must be less than 100');
	}

	const { data: apartments, error: err } = await query.limit(limit ?? 100);

	if (err) {
		return error(500, err.message);
	}

	if (!apartments) {
		return error(404, 'no apartments found');
	}

	return json(apartments);
}
