import { CircleMarker, circleMarker, latLng, LatLng, MapOptions, tileLayer } from "leaflet";
import { ionColorPrimary } from "../../app.constants";

export const defaultLatLng: LatLng = latLng(32.158613, 34.806668);

export const mapOptions: MapOptions = {
  layers: [
    tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      minZoom: 5,
      maxZoom: 19,
    })
  ],
  zoom: 15,
  zoomControl: false,
  attributionControl: false
}

export const currentPositionMarker: (coords: LatLng) => CircleMarker = (coords) => circleMarker(coords, {
  radius: 7,
  fill: true,
  fillColor: ionColorPrimary,
  fillOpacity: 0.5,
  weight: 2,
  color: ionColorPrimary
});
