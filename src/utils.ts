import { icon, LatLngLiteral } from 'leaflet';

import bikeParkingIcon from './icons/bike-parking@2x.png';
import destinationIcon from './icons/destination@2x.png';

export const getHashAsLocation = (hash: string) => {
	const parsedHash: Record<string, string> = hash.replace(/^#/, '').split('&')
		.reduce((acc, h) => ({ ...acc, [h.split('=')[0]]: h.split('=')[1] }), {})
	;

	return parsedHash.destination && parsedHash.destination.split(',')
		.reduce((acc, c, i) => ({ ...acc, [!i ? 'lat' : 'lng']: parseFloat(c) }), {}) as LatLngLiteral
	;
};

export const Icon = {
	Destination: icon({
		iconUrl: destinationIcon,
		iconSize: [30, 30],
		iconAnchor: [15, 30],
		tooltipAnchor: [15, -15],
		className: 'marker--destination',
	}),
	Parking: icon({
		iconUrl: bikeParkingIcon,
		iconSize: [50, 50],
		iconAnchor: [25, 50],
		tooltipAnchor: [0, -25],
		className: 'marker--parking',
	}),
};
