import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h1>Dashboard:</h1>
    <div class="button-group" role="group" aria-label="Basic example">
      <button type="button" class="btn btn-primary" routerLink="/products">Products</button>
      <button type="button" class="btn btn-secondary" routerLink="/category">Categories</button>
      <button type="button" class="btn btn-success" routerLink="/sales">Order Lists</button>
      <button type="button" class="btn btn-info" routerLink="/sales/add">Add Order</button>

      <button 
        type="button" 
        class="btn btn-outline-secondary" 
        (click)="toggleTheme()">
        
        {{ currentTheme === 'dark' ? 'Light Mode' : 'Dark Mode' }}
        
      </button>
    </div>


  `,
  styleUrl: './dashboard.css',
})
export class Dashboard {
  // 1. Keep track of the theme in a variable
  currentTheme: 'light' | 'dark' = 'light';

  ngOnInit() {
    // 2. Load preference on startup
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    
    if (savedTheme) {
      this.setTheme(savedTheme);
    } else {
      // Use system preference if nothing is saved
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme(systemPrefersDark ? 'dark' : 'light');
    }
  }

  // 3. Toggle logic
  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  // 4. Helper to apply changes
  private setTheme(theme: 'light' | 'dark') {
    this.currentTheme = theme;
    
    // Set the attribute on the <html> tag for Bootstrap
    document.documentElement.setAttribute('data-bs-theme', theme);
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
  }

}
