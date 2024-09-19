<script context="module" lang="ts">
	export type Selection = {
		bounds: [[lat: number, lng: number], [lat: number, lng: number]];
		label: string;
		raw: any;
		x: number;
		y: number;
	};
</script>

<script lang="ts">
	import 'leaflet/dist/images/layers-2x.png';
	import 'leaflet/dist/images/layers.png';
	import 'leaflet/dist/images/marker-icon-2x.png';
	import 'leaflet/dist/images/marker-icon.png';
	import 'leaflet/dist/images/marker-shadow.png';
	import 'leaflet/dist/leaflet.css';
	import 'leaflet-geosearch/dist/geosearch.css';

	import type { OpenStreetMapProvider } from 'leaflet-geosearch';
	import type { Map, LatLngTuple, Marker } from 'leaflet';
	import { onMount } from 'svelte';
	import type * as Leaflet from 'leaflet';
	import type { Writable } from 'svelte/store';

	let all_markers: Marker[] = [];
	let search_marker: Marker;
	let map: Map;
	let mapOptions = {
		center: [40.727611, -73.841805],
		zoom: 13
	};
	let tileLayerURL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
	let provider: OpenStreetMapProvider;
	let L: typeof Leaflet;

	export function setMarkers(nearbyListing: NearbyListingData[]) {
		console.log("test");
		all_markers.forEach((marker) => {
			map.removeLayer(marker);
		});

		nearbyListing.forEach((elem) => {
			const marker = L.marker([elem.long, elem.lat]).addTo(map);
			marker.bindPopup(`<b>${elem.title}</b><br>${elem.location_label}`);
			all_markers.push(marker);
		});
	}

	export let selection: Writable<Selection | undefined> | Selection | undefined;

	onMount(async () => {
		L = await import('leaflet');
		const { GeoSearchControl, OpenStreetMapProvider } = await import('leaflet-geosearch');

		map = L.map('map').setView(mapOptions.center as LatLngTuple, mapOptions.zoom);
		L.tileLayer(tileLayerURL, {
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);

		provider = new OpenStreetMapProvider();
		const gsc = GeoSearchControl({
			provider,
			style: 'bar',
			searchLabel: 'Search for a location'
		});
		gsc.addTo(map);

		map.on('geosearch/showlocation', (e) => {
			if (Object.hasOwn(e, 'location')) {
				// @ts-ignore
				const loc = e.location;

				if (selection && 'set' in selection) {
					selection.set(loc);
				} else {
					selection = loc;
				}
			}
		});

		navigator.geolocation.getCurrentPosition((position) => {
			mapOptions.center = [position.coords.latitude, position.coords.longitude];
			map.setView(mapOptions.center as LatLngTuple, mapOptions.zoom);
		});
	});
</script>

<div id="map" class="h-[calc(100%-50px)] w-full rounded-xl z-[2]"></div>
