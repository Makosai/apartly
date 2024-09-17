<script lang="ts">
	import type { OpenStreetMapProvider } from 'leaflet-geosearch';
	import type { Map, LatLngTuple, Marker } from 'leaflet';
	import { onMount } from 'svelte';
	import type * as Leaflet from 'leaflet';
	import type { SearchResult } from 'leaflet-geosearch/dist/providers/provider.js';

	type Selection = {
		query: string;
		data?: SearchResult;
	};

	type MarkerDict = { [key: string]: Marker };
	const markers: MarkerDict = {};
	let search_marker: Marker;
	let map: Map;
	let mapOptions = {
		center: [51.505, -0.09],
		zoom: 13
	};
	let tileLayerURL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
	let provider: OpenStreetMapProvider;
	let L: typeof Leaflet;

	onMount(async () => {
		await Promise.all([
			await import('leaflet/dist/leaflet.css'),
			await import('leaflet-geosearch/dist/geosearch.css')
		]);

		const L = await import('leaflet');
		const { GeoSearchControl, OpenStreetMapProvider } = await import('leaflet-geosearch');

		map = L.map('map').setView(mapOptions.center as LatLngTuple, mapOptions.zoom);
		L.tileLayer(tileLayerURL, {
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);

		provider = new OpenStreetMapProvider();
		const gsc = GeoSearchControl({
			provider,
			style: 'width: 100%',
			autoComplete: true,
			searchLabel: 'Search for a location',
			onSubmit: search
		});
		document.getElementById('map-search')?.appendChild(gsc.searchElement.container);
		gsc.open();

		navigator.geolocation.getCurrentPosition((position) => {
			mapOptions.center = [position.coords.latitude, position.coords.longitude];
			map.setView(mapOptions.center as LatLngTuple, mapOptions.zoom);
		});
	});

	function search(result: Selection) {
		if (!result.data) return;
		const { x, y } = result.data;
		const latlng = [y, x];
		if (search_marker) {
			map.removeLayer(search_marker);
		}
		search_marker = L.marker(latlng as LatLngTuple).addTo(map);
		map.setView(latlng as LatLngTuple, 13);
	}
</script>

<div id="map-search" class="w-full pb-4" />
<div id="map" class="h-[calc(100%-50px)] w-full rounded-xl"></div>

<style lang="postcss">
	#map-search {
		@apply relative h-10 mb-4;
	}
	#map-search :global(a), #map-search :global(button) {
		@apply hidden;
	}
	#map-search :global(.geosearch) {
		@apply absolute w-full h-10;
	}

	#map-search :global(input.glass) {
		@apply w-full h-10 outline-none text-base !rounded-lg;
		box-shadow: none;
	}

	#map-search :global(form) {
		@apply left-0 relative z-50 p-0 !rounded-lg;
	}
</style>
