import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IonModal } from "@ionic/angular";
import { isArray, isEqual, isFunction } from "../../helpers/object.helper";
import { ToastService } from "../../services/toast.service";

@Component({
  selector: 'app-select-card',
  templateUrl: './select-card.component.html',
  styleUrls: ['./select-card.component.scss'],
})
export class SelectCardComponent implements OnInit {
  @ViewChild("modal", { static: true }) modal!: IonModal;

  @Input() title!: string;
  @Input() value!: any;
  @Input() toggle!: boolean;
  @Input() valueProp: string = "name";
  @Input() selectText: string = "select";
  @Input() icon?: string;
  @Input() options?: any[] | Function;

  @Output() valueChanged = new EventEmitter<any>();
  @Output() toggleChange = new EventEmitter<boolean>();
  @Output() toggleChanged = new EventEmitter<boolean>();

  optionsArray: any[] = [];
  searchTerm: string = "";
  searchOptions: any[] = [];

  constructor(
    private _toastService: ToastService
  ) { }

  ngOnInit() {
    if (Array.isArray(this.options)) {
      this.optionsArray = [...this.options];
    }
  }

  toggleChangedFn(toggle: any) {
    if (this.toggle !== toggle.detail.checked) {
      this.toggleChange.emit(toggle.detail.checked);
      this.toggleChanged.emit(toggle.detail.checked);
    }
  }

  valueChangedFn(dismissValue: any) {
    const value = dismissValue.detail.data;
    if (isEqual(value, this.value)) {
      this.valueChanged.emit(null);
    } else if (value) {
      this.valueChanged.emit(value);
    }
  }

  async openModal() {
    if (isArray(this.options)) {
      await this.modal.present();
    } else if (isFunction(this.options)) {
      try {
        this.optionsArray = await this.options();
        this.searchOptions = [...this.optionsArray];
        await this.modal.present();
      } catch (e: any) {
        console.error(e);
        await this._toastService.error(e);
      }
    } else {
      console.warn("Options format not supported");
    }
  }

  async dismissModal(dismissValue: any) {
    await this.modal.dismiss(dismissValue);
  }

  search(searchTerm: string) {
    if (this.options && !searchTerm) {
      this.searchOptions = [...this.optionsArray];
    }
    this.searchOptions = this.optionsArray?.filter((accessory: any) => {
      return accessory[this.valueProp].toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }
}
