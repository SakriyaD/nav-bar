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
            <label for="category" class="form-label">Add a category</label>
            <input 
              #categoryInput
              type="text" 
              class="form-control" 
              id="category" 
              name="category" 
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
            <tr *ngFor="let c of categories">
              <th scope="row">{{c}}</th>
              <td><a href="" (click)="onRemove(c); $event.preventDefault()">Remove</a></td>
            </tr>
          </tbody>
        </table>

      </div>
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

    console.log('Item removed');
  }
}
