import { CdkTrapFocus } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-products',
  imports: [ReactiveFormsModule, CommonModule, CdkTrapFocus],
  template: `
    <div class="product-container" cdkTrapFocus="">
      <h1>Products:</h1>
      <div class="action">
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">Add a product</button>
      </div>
      <!-- Search bar added above table header for quick product filtering -->
      <div class="search-wrapper mb-3">
        <label for="product-search" class="form-label fw-bold">Search Products</label>
        <input
          id="product-search"
          #productSearchInput
          type="text"
          class="form-control"
          placeholder="Search by id, name, category or rate"
          [value]="searchTerm"
          (input)="onSearch(productSearchInput.value)"
        >
      </div>
      <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">{{ editingProductId === null ? 'Add a product' : 'Edit product' }}</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="add-product">
                <div class="mb-3">
                  <label class="col-form-label" for="category">
                    Category: 
                    <select 
                      #categoryInput
                      formControlName='category' 
                      class= "form-control" 
                      name="category" 
                      id="category" 
                      required
                      (ngModelChange)="productInput.focus()"
                    >
                      <option value="">--Choose an option--</option>
                      <option *ngFor="let c of categories" [value]="c" >{{c}}</option>
                      
                    </select>
                  </label> 
                </div> 
                <div class="mb-3">
                  <label class="col-form-label" for="name">
                    Product name:
                    <input 
                      #productInput
                      formControlName='name' 
                      type="text" 
                      class= "form-control" 
                      placeholder="Name" 
                      required
                      (keyup.enter)="focus(rateInput)"
                    >
                  </label> 
                </div>
                <div class="mb-3">
                  <label class="col-form-label" for="rate">
                    Product rate (Rs.):
                    <input 
                      #rateInput
                      formControlName='rate' 
                      type="number" 
                      class= "form-control"
                      placeholder="0" 
                      min="0" 
                      required
                      
                    >
                  </label>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button #submitButton type="submit" class="btn btn-primary">{{ editingProductId === null ? 'Submit' : 'Update' }}</button>
                </div>                         
              </form>
            </div>

          </div>
        </div>
      </div>
      <div class="product-content">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Id</th>
              <th scope="col">Product name</th>
              <th scope="col">Category</th>
              <th scope="col">Rate (Rs.)</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody class="table-group-divider">
            <tr *ngFor= "let p of paginatedProducts">
              <th scope="row">{{p.id}}</th>
              <td>{{p.name}}</td>
              <td>{{p.category}}</td>
              <td>{{p.rate}}</td>
              <td>
                <a href="" (click)="onEdit(p); $event.preventDefault()" data-bs-toggle="modal" data-bs-target="#exampleModal">Edit</a> 
                / 
                <a href="" (click)="onRemove(p); $event.preventDefault()" >Remove</a></td>
            </tr>
            <tr *ngIf="paginatedProducts.length === 0">
              <td colspan="5" class="text-center">No products found.</td>
            </tr>            
          </tbody>
        </table>

      </div>
      <nav aria-label="Page navigation example">
        <ul class="pagination justify-content-center">
          <li class="page-item" [class.disabled] = "currentPage === 1">
            <button class="page-link" (click)="goToPage(currentPage - 1)" [disabled]="currentPage === 1">Previous</button>
          </li>
          <li class="page-item" *ngFor="let page of pages" [class.active]="page === currentPage">
            <button class="page-link" (click)="goToPage(page)">{{page}}</button>
          </li>
          <li class="page-item" [class.disabled]="currentPage === totalPages || totalPages === 0">
            <button class="page-link" (click)="goToPage(currentPage + 1)" [disabled]="currentPage === totalPages || totalPages === 0">Next</button>
          </li>
        </ul>
      </nav>

    </div>
  `,
  styleUrl: './products.css',
})
export class Products implements AfterViewInit {

  @ViewChild('categoryInput') categoryInput!: ElementRef<HTMLInputElement>;

  ngAfterViewInit() {
    // initial focus if modal is already visible for some reason
    this.categoryInput.nativeElement.focus();

    // also focus whenever the Bootstrap modal is shown
    const modalElement = document.getElementById('exampleModal');
    if (modalElement) {
      modalElement.addEventListener('shown.bs.modal', () => {
        this.categoryInput.nativeElement.focus();
      });
    }
  }

  focus(next: HTMLInputElement){
    if (next) {
      next.focus();
    }
  }

  productList: { id: number; name: string; category: string; rate: number }[] = [];
  searchTerm = '';
  
  categories: string[] = [];

  //pagination states
  itemsPerPage = 10;
  currentPage = 1;
  totalPages = 0;
  pages: number[] = [];
  paginatedProducts: { id: number; name: string; category: string; rate: number }[] = [];

  //null = add mode, number = id of product being edited
  editingProductId: number | null = null;

  //method to update the page to view correctly
  private updatePagination(){
    // Pagination runs on filtered data so search + paging work together.
    const filteredProducts = this.getFilteredProducts();

    this.totalPages = Math.ceil(filteredProducts.length / this.itemsPerPage) || 0;

    //if currentPage is too big, brings to last page
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }

    //if currentPage is too small, brings to first page
    if (this.currentPage < 1 && this.totalPages > 0) {
      this.currentPage = 1;
    }

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);

  }

  private getFilteredProducts(): { id: number; name: string; category: string; rate: number }[] {
    const query = this.searchTerm.trim().toLowerCase();

    if (!query) {
      return this.productList;
    }

    // Linear (sequential) search with substring matching using filter + includes.
    return this.productList.filter((product) =>
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      String(product.id).includes(query) ||
      String(product.rate).includes(query)
    );
  }

  onSearch(value: string): void {
    // Reset to first page whenever search query changes.
    this.searchTerm = value;
    this.currentPage = 1;
    this.updatePagination();
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    this.updatePagination();
  }

  //this loads the data from localstorage
  constructor() {
    const saved = localStorage.getItem('products');
    if (saved) {
      try {
        this.productList = JSON.parse(saved);
      } catch {
        //if parsing fails, keep default productlist
      }
    }

    const savedCategories = localStorage.getItem('categories');
    if (savedCategories) {
      try {
        this.categories = JSON.parse(savedCategories);
      } catch {
        this.categories = [];
      }
    }

    //calls the method
    this.updatePagination();

  }  

  productForm = new FormGroup({
    name: new FormControl<string>('', Validators.required),
    category: new FormControl<string>('', Validators.required),
    rate: new FormControl<number | null>(null, Validators.required)
  });

  onEdit(product: { id: number; name: string; category: string; rate: number }) {
    //this switch to edit mode
    this.editingProductId = product.id;

    //allow to fill the form with existing product values
    this.productForm.setValue({
      name: product.name,
      category: product.category,
      rate: product.rate,
    });
  }

  onSubmit() {
    if (!this.productForm.valid) {
      return;
    }

    const { name, category, rate } = this.productForm.value;

    if (this.editingProductId === null) {
      // ADD MODE

      //finds the highest id on the existing list and increments the id for next product
      const nextId =
        this.productList.length > 0
          ? Math.max(...this.productList.map(p => p.id)) + 1
          : 1;

      //add recent form data to first of the array
      this.productList.unshift({
        id: nextId,
        name: name as string,
        category: category as string,
        rate: rate as number,
      });

      console.log('item added');
    } else {

    //EDIT MODE
    this.productList = this.productList.map(p =>
      p.id === this.editingProductId
        ? {
            ...p,
            name: name as string,
            category: category as string,
            rate: rate as number,
          }
        : p
    );

    console.log('item updated');
    }

    //this saves the data to the local storage
    localStorage.setItem('products', JSON.stringify(this.productList));

    // keep current page in range and refresh view
    this.updatePagination();

    //reset form and exit edit mode
    this.productForm.reset();
    this.editingProductId = null;
  }

  onRemove(product: { id: number; name: string; category: string; rate: number }){
    //this ask for confirmation
    const confirmed = confirm(`Are you sure you want to remove "${product.name}"?`);
    if (!confirmed) {
      return;
    }  

    //removes the selected product
    this.productList = this.productList.filter(p => p.id !== product.id);
    //saves the current state list of product
    localStorage.setItem('products', JSON.stringify(this.productList));

    this.updatePagination();

    console.log('product removed');
  }
  
}
