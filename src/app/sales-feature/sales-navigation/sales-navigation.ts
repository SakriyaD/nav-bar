import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-sales-navigation',
  imports: [RouterLink],
  template: `
    <div class="navigation mb-3">
      <div [class.ms-auto]="!showSave">
        @if (showAdd) {
        <button type="button" class="btn btn-primary" routerLink="../add">Add Order</button>
        }

      </div>
      @if (showSave) {
      <div class="button-group">
        <button 
          type="button" 
          class="btn btn-primary" 
          (click)="saveSale.emit()"
        >                               
          Save order
        </button>
        @if (showView) {
        <button type="button" class="btn btn-primary" routerLink="../">Order Lists</button>
        }
      </div>
      }
    </div>
  `,
  styleUrl: './sales-navigation.css',
})
export class SalesNavigation {
  // @Input() canSave = false;
  @Input() showSave = false;
  @Input() showView = false;
  @Input() showAdd = true;

  @Output() saveSale = new EventEmitter<void>();

}
