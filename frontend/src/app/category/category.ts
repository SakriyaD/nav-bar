import { CdkTrapFocus } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category',
  imports: [ CommonModule, FormsModule, CdkTrapFocus ],
  template: `
    <div class="category-container" cdkTrapFocus>
      <h1>Category:</h1>
      <form (ngSubmit)='onSubmit()' class="add-category">
        <div class="category-toolbar mb-3">
          <div class="category-input-wrapper">
            <input 
              #categoryInput
              type="text" 
              class="form-control" 
              id="category" 
              name="category" 
              placeholder="Name a category"
              [(ngModel)]="newCategory" 
              required
              
            >
          </div>
          <button type="submit" class="btn btn-primary">+ Add category</button>
        </div>
      </form>
      <h2>
        List of categories:  
      </h2>
      <div class="category-content">
        <table class="table">
          <thead>
          <tr>
              <th scope="col">Category</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody class="table-group-divider">
            <tr *ngFor="let c of paginatedCategories">
              <th scope="row">{{c}}</th>
              <td><a href="" (click)="onRemove(c); $event.preventDefault()">Remove</a></td>
            </tr>
            <tr *ngIf="paginatedCategories.length === 0">
              <td colspan="2" class="text-center">No categories found.</td>
            </tr>
          </tbody>
        </table>

      </div>

      <nav aria-label="Category pagination">
        <ul class="pagination justify-content-center">
          <li class="page-item" [class.disabled]="currentPage === 1">
            <button class="page-link" (click)="goToPage(currentPage - 1)" [disabled]="currentPage === 1">Previous</button>
          </li>
          <li class="page-item" *ngFor="let page of pages" [class.active]="page === currentPage">
            <button class="page-link" (click)="goToPage(page)">{{ page }}</button>
          </li>
          <li class="page-item" [class.disabled]="currentPage === totalPages || totalPages === 0">
            <button class="page-link" (click)="goToPage(currentPage + 1)" [disabled]="currentPage === totalPages || totalPages === 0">Next</button>
          </li>
        </ul>
      </nav>
    </div>
    
  `,
  styleUrl: './category.css',
})
export class Category implements AfterViewInit {

  //for focusing on the customer input on page load
  @ViewChild('categoryInput') categoryInput!: ElementRef<HTMLInputElement>;

  ngAfterViewInit() {
    this.categoryInput.nativeElement.focus();
  }

  newCategory = '';

  categories: string[] = [];
  paginatedCategories: string[] = [];

  // Pagination state (same pattern as products page).
  itemsPerPage = 10;
  currentPage = 1;
  totalPages = 0;
  pages: number[] = [];

  private updatePagination(): void {
    this.totalPages = Math.ceil(this.categories.length / this.itemsPerPage) || 0;

    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }

    if (this.currentPage < 1 && this.totalPages > 0) {
      this.currentPage = 1;
    }

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    this.paginatedCategories = this.categories.slice(startIndex, endIndex);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }

    this.currentPage = page;
    this.updatePagination();
  }

  //saved data is called by this
  constructor() {
    const saved = localStorage.getItem('categories');
    if (saved) {
      try {
        this.categories = JSON.parse(saved);
      } catch {
        this.categories = [];
      }
    }

    this.updatePagination();
  }  

  onSubmit(){

    const trimmed = this.newCategory.trim();
    if (!trimmed) {
      return;
    }

    //new category is added to the top of the list
    this.categories.unshift(trimmed);

    //this save to the localstorage
    localStorage.setItem('categories', JSON.stringify(this.categories));

    // Keep current page stable and refresh page slice.
    this.updatePagination();

    //this clears the input field
    this.newCategory = '';
    
    console.log('Category added');
  }

  onRemove(category: string){
    const confirmed = window.confirm(`Are you sure you want to remove "${category}"?`);
    if (!confirmed) {
      return;
    }  
    //filters out the selected category and removes the selected category
    this.categories = this.categories.filter(c => c !== category);
    //saves the current list of categories
    localStorage.setItem('categories', JSON.stringify(this.categories));

    this.updatePagination();

    console.log('Item removed');
  }
}
