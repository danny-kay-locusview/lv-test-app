import { Component } from '@angular/core';
import { StatusBar, Style } from "@capacitor/status-bar";
import { ionColorSecondary } from "./app.constants";
import { Platform } from "@ionic/angular";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private _platform: Platform
  ) {
    this.initialize();
  }

  //#region Private Methods

  private async initialize() {
    if (this._platform.is("capacitor")) {
      try {
          await StatusBar.setStyle({ style: Style.Dark });
          await StatusBar.setBackgroundColor({ color: ionColorSecondary });
      } catch (e) {
        console.error(e);
      }
    }
  }
  //#endregion
}
