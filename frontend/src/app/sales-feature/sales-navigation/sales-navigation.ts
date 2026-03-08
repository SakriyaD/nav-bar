import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-sales-navigation',
  imports: [RouterLink],
  template: `
    <div class="navigation mb-3">
      @if (showSearch) {
      <div class="search-wrapper">
        <label for="sales-navigation-search" class="visually-hidden">Search Orders</label>
        <input
          id="sales-navigation-search"
          #searchInput
          type="text"
          class="form-control"
          [value]="searchValue"
          [placeholder]="searchPlaceholder"
          (input)="searchChange.emit(searchInput.value)"
        >
      </div>
      }
      <div class="button-group">
        @if (showAdd) {
        <button type="button" class="btn btn-primary" routerLink="../add">+ Add Order</button>
        }

        @if (showSave) {
        <button 
          type="button" 
          class="btn btn-primary" 
          (click)="saveSale.emit()"
        >                               
          Save order
        </button>
        }

        @if (showView) {
        <button type="button" class="btn btn-primary" routerLink="../">Order Lists</button>
        }
      </div>
    </div>
  `,
  styleUrl: './sales-navigation.css',
})
export class SalesNavigation {
  // @Input() canSave = false;
  @Input() showSave = false;
  @Input() showView = false;
  @Input() showAdd = true;
  @Input() showSearch = false;
  @Input() searchValue = '';
  @Input() searchPlaceholder = 'Search';

  @Output() saveSale = new EventEmitter<void>();
  @Output() searchChange = new EventEmitter<string>();

}
