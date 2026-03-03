import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  template: `
    <h1>Dashboard</h1>
    <div class="button-group" role="group" aria-label="Quick navigation">
      <button type="button" class="btn btn-primary" routerLink="/products">Products</button>
      <button type="button" class="btn btn-secondary" routerLink="/category">Categories</button>
      <button type="button" class="btn btn-success" routerLink="/sales">Order Lists</button>
      <button type="button" class="btn btn-info" routerLink="/sales/add">Add Order</button>
    </div>
  `,
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {}
