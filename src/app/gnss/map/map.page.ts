import { Component } from '@angular/core';
import { latLng, Map, Layer, LatLng, MapOptions, circleMarker } from "leaflet";
import { currentPositionMarker, defaultLatLng, mapOptions } from "./map.constants";
import { GnssService } from "../gnss.service";
import { skip, Subject, takeUntil } from "rxjs";
import { GNSSData } from "gnssplugin";

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage {
  options: MapOptions = mapOptions;
  center: LatLng = defaultLatLng;
  zoom = 15;
  currentPosition?: Layer;
  data?: GNSSData;

  private _onDestroy$ = new Subject();

  constructor(
    private _gnssService: GnssService
  ) { }

  //#region Public Methods

  ionViewWillEnter() {
    this._gnssService.data$
      .pipe(skip(1), takeUntil(this._onDestroy$))
      .subscribe((data) => {
        this.data = data;
        if (data.latitude && data.longitude) {
          const location = latLng(data.latitude, data.longitude);
          this.currentPosition = currentPositionMarker(location);
        } else {
          this.currentPosition?.remove();
        }
      });
  }

  ionViewWillLeave() {
    this._onDestroy$.complete();
  }

  onMapReady(event: Map) {
    setTimeout(() => {
      event.invalidateSize();
    }, 200);
  }

  //#endregion
}
