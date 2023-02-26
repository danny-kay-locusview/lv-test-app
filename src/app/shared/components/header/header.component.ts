import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterOutlet } from "@angular/router";
import { IonRouterOutlet } from "@ionic/angular";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() title?: string;
  @Input() transparent?: boolean;
  @Input() hamburger?: boolean;

  canGoBack: boolean = false;

  constructor(
    private routerOutlet: IonRouterOutlet
  ) { }

  ngOnInit() {
    this.canGoBack = this.routerOutlet.canGoBack();
  }
}
