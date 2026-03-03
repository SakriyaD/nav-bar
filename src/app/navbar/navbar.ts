import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { RoleService } from '../role.service';
import { TrapFocusDirective } from '../trap-focus.directive';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, TrapFocusDirective],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navbar implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly roleService = inject(RoleService);
  private readonly router = inject(Router);
  readonly themeService = inject(ThemeService);

  readonly isLoginPage = signal(false);
  readonly isSignupPage = signal(false);
  readonly showLogoutConfirm = signal(false);

  // Expose theme signal from service for the template
  readonly currentTheme = this.themeService.currentTheme;

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isLoginPage.set(event.urlAfterRedirects === '/login');
      this.isSignupPage.set(event.urlAfterRedirects === '/signup');
    });
  }

  ngOnInit(): void {
    this.themeService.loadSavedTheme();
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

  onLogout(): void {
    this.showLogoutConfirm.set(true);
  }

  confirmLogout(): void {
    this.showLogoutConfirm.set(false);
    this.authService.logout();
  }

  cancelLogout(): void {
    this.showLogoutConfirm.set(false);
  }

  toggleTheme(): void {
    const newTheme = this.currentTheme() === 'light' ? 'dark' : 'light';
    this.themeService.applyTheme(newTheme);
  }
}
