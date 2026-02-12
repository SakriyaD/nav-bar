import { Component, signal, OnInit, inject } from '@angular/core';
import { RouterLink, RouterOutlet, Router, NavigationEnd } from '@angular/router'; // Import Router and NavigationEnd
import { CommonModule } from '@angular/common'; // Import CommonModule
import { AuthService } from './auth.service';
import { RoleService } from './role.service';
import { filter } from 'rxjs/operators'; // Import filter

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, CommonModule], // Add CommonModule
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('nav-bar');
  private readonly authService = inject(AuthService);
  private readonly roleService = inject(RoleService);
  private readonly router = inject(Router); // Inject Router
  
  isLoginPage = false;
  isSignupPage = false;
  showLogoutConfirm = false;
  
  // Keep track of the theme in a variable
  currentTheme: 'light' | 'dark' = 'light';

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isLoginPage = event.urlAfterRedirects === '/login';
      this.isSignupPage = event.urlAfterRedirects === '/signup';
    });
  }

  ngOnInit() {
    //Load preference on startup
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    
    if (savedTheme) {
      this.setTheme(savedTheme);
    }
    else {
      // Use system preference if nothing is saved
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme(systemPrefersDark ? 'dark' : 'light');
    }
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get isAdmin(): boolean {
    return this.roleService.isAdmin();
  }

  get isUser(): boolean {
    return this.roleService.isUser();
  }

  // Opens custom logout confirmation dialog (Yes/No buttons in template).
  onLogout(): void {
    this.showLogoutConfirm = true;
  }

  // Confirms logout and delegates session cleanup to AuthService.
  confirmLogout(): void {
    this.showLogoutConfirm = false;
    this.authService.logout();
  }

  // Closes dialog without logging the user out.
  cancelLogout(): void {
    this.showLogoutConfirm = false;
  }

  //Toggle logic
  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  //Helper to apply changes
  private setTheme(theme: 'light' | 'dark') {
    this.currentTheme = theme;
    
    // Set the attribute on the <html> tag for Bootstrap
    document.documentElement.setAttribute('data-bs-theme', theme);
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
  }
}
