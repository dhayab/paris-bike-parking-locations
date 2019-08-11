import { LatLngLiteral, LatLngTuple } from 'leaflet';

type ApiResponse = {
	records: ReadonlyArray<{
		fields: {
			dist: string,
			geo_point_2d: LatLngTuple,
		},
	}>,
};

const API = 'https://opendata.paris.fr/api/records/1.0/search/?dataset=stationnement-sur-voie-publique-emprises&refine.regpar=Vélos&geofilter.distance';
const DISTANCE = 200;
const ENTRIES = 5;
const MAPS = 'https://www.google.com/maps/dir/?api=1&travelmode=bicycling&destination';

export const getBikeParkingLocations = async (destination: LatLngLiteral) => {
	const response = await fetch(`${API}=${destination.lat},${destination.lng},${DISTANCE}&rows=${ENTRIES}`);
	const records = (await response.json() as ApiResponse).records;

	return records.map((record) => ({
		coords: record.fields.geo_point_2d,
		distance: record.fields.dist,
	}));
};

export const openMapsNavigation = (destination: LatLngLiteral) => {
	window.open(`${MAPS}=${destination.lat},${destination.lng}`);
};
