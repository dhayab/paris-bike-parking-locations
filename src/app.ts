import 'leaflet/dist/leaflet.css';
import './app.scss';

import L, { LatLngLiteral, LatLngTuple } from 'leaflet';

import { Modal, ModalType } from './modal';
import { getBikeParkingLocations, openMapsNavigation } from './services';
import { getHashAsLocation, Icon } from './utils';

require('leaflet-providers'); // tslint:disable-line:no-var-requires

const DEFAULT_COORDS: LatLngTuple = [48.858779, 2.344626]; // tslint:disable-line:no-magic-numbers
const ZOOM_CITY = 13;
const ZOOM_DISTRICT = 17;

// initialize map
const map = L.map(document.querySelector('.map') as HTMLElement).setView(DEFAULT_COORDS, ZOOM_CITY);
L.tileLayer.provider('Stamen.TonerLite').addTo(map);
const markers = L.layerGroup().addTo(map);

const modal = new Modal();

// handle map updates
const updateMap = async (destination: LatLngLiteral) => {
	modal.open(ModalType.Loading, 'Chargement des emplacements en cours...');

	markers.clearLayers();

	L.marker(destination, { icon: Icon.Destination }).addTo(markers).bindTooltip('Destination', { direction: 'right' });
	map.setView(destination, ZOOM_DISTRICT);

	try {
		const locations = await getBikeParkingLocations(destination);

		if (!locations.length) {
			modal.open(ModalType.Error, `Il n'y a pas d'emplacements près de cette position`);
			return;
		}

		for (const location of locations) {
			L.marker(location.coords, { icon: Icon.Parking }).addTo(markers)
				.bindTooltip(`à ${location.distance} mètres`, { direction: 'center' })
				.addEventListener('click', () => openMapsNavigation({ lat: location.coords[0], lng: location.coords[1] }))
			;
		}

		modal.close();
	} catch (e) {
		modal.open(ModalType.Error, 'Une erreur est survenue');
	}
};

const checkDestination = () => {
	const destination = getHashAsLocation(location.hash);
	destination && updateMap(destination);
	return destination;
};

// check for destination hash or prompt for geolocation
if (!checkDestination()) {
	new Promise<Position>((resolve, reject) => {
		modal.open(ModalType.Loading, 'Géolocalisation en cours...');
		navigator.geolocation.getCurrentPosition(
			(pos) => resolve(pos),
			(err) => reject(err),
			{ enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
		);
	})
		.then((pos) => {
			location.hash = `destination=${pos.coords.latitude},${pos.coords.longitude}`;
		})
		.catch(() => {
			modal.open(ModalType.Error, 'Vous devez autoriser la géolocalisation pour utiliser cette carte');
		})
	;
}

// listen for destination hash change
window.addEventListener('hashchange', checkDestination);
