<script lang="ts">
	import type { Map, LatLngTuple, Marker } from 'leaflet';
	import { onMount } from 'svelte';

	type MarkerDict = { [key: string]: Marker };
	const markers: MarkerDict = {};

	let map: Map;
	let mapOptions = {
		center: [51.505, -0.09],
		zoom: 13
	};
	let tileLayerURL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

	onMount(async () => {
		await import('leaflet/dist/leaflet.css');
		await import('leaflet-geosearch/dist/geosearch.css');
		const L = await import('leaflet');
		const { GeoSearchControl, OpenStreetMapProvider } = await import('leaflet-geosearch');

		map = L.map('map').setView(mapOptions.center as LatLngTuple, mapOptions.zoom);
		L.tileLayer(tileLayerURL, {
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);

		const GeoSearch = GeoSearchControl({
			provider: new OpenStreetMapProvider()
		});
		GeoSearch.addTo(map);
		GeoSearch.setPosition('topright');
		GeoSearch.open();

		navigator.geolocation.getCurrentPosition((position) => {
			mapOptions.center = [position.coords.latitude, position.coords.longitude];
			map.setView(mapOptions.center as LatLngTuple, mapOptions.zoom);
		});
	});

	// let map: any;
	// const GeoSearch = GeoSearchControl({
	// 	provider: new OpenStreetMapProvider()
	// });
</script>

<div id="map" class="h-full w-full rounded-xl"></div>
