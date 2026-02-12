import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink, Router } from "@angular/router";
import { LocalStorage } from '../local-storage';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { TrapFocusDirective } from '../trap-focus.directive';

type RegisteredUser = {
  name: string;
  username: string;
  email: string;
  password: string;
};

@Component({
  selector: 'app-login-page',
  imports: [FormsModule, RouterLink, CommonModule, TrapFocusDirective],
  template: `
    <div appTrapFocus class="container d-flex justify-content-center align-items-center">
      <div class="card shadow-lg p-4" style="max-width: 450px; width: 100%; border-radius: 15px;">
        <div class="text-center mb-4">
          <i class="bi bi-shield-lock fs-1 text-primary"></i>
          <h2 class="fw-bold">Login</h2>
        </div>

        @if (showLoginSuccessAlert) {
          <div class="alert alert-success" role="status" aria-live="polite">
            Logged in successfully.
          </div>
        }

        <form #loginForm="ngForm" (ngSubmit)="onLogin(loginForm)">
          <div class="mb-3">
            <label class="form-label small fw-bold">Email or Username</label>
            <input 
              #firstFocusableElement
              type="text" 
              name="identifier" 
              class="form-control" 
              [(ngModel)]="user.identifier" 
              required 
              #identifier="ngModel"
              [class.is-invalid]="identifier.invalid && identifier.touched">
            <div class="invalid-feedback">Please enter your email or username.</div>
          </div>

          <div class="mb-3">
            <label class="form-label small fw-bold">Password</label>
            <div class="input-group">
              <input 
                [type]="showPassword ? 'text' : 'password'" 
                name="password" 
                class="form-control" 
                [(ngModel)]="user.password" 
                required 
                minlength="6"
                #pwd="ngModel"
                [class.is-invalid]="pwd.invalid && pwd.touched">
              <button
                type="button"
                class="btn btn-outline-secondary"
                (click)="togglePasswordVisibility()"
                [attr.aria-label]="showPassword ? 'Hide password' : 'Show password'"
                [attr.aria-pressed]="showPassword"
              >
                <i [class]="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
            </div>
            <div class="invalid-feedback">Password must be at least 6 characters.</div>
          </div>

          <button type="submit" class="btn btn-primary w-100 mt-2" [disabled]="loginForm.invalid">
            Sign In
          </button>
        </form>
        
        <p class="text-center mt-3 small">
          New here? <a routerLink="/signup" class="text-decoration-none">Create account</a>
        </p>
      </div>
    </div>
  `,
  styleUrl: './login-page.css',
})
export class LoginPage implements AfterViewInit {
  @ViewChild('firstFocusableElement') firstFocusableElement: ElementRef | undefined;
  // Login now accepts a single identifier field (email OR username).
  user = {
    identifier: '',
    password: ''
  };

  // UI states for password toggle and 1-second success alert.
  showPassword = false;
  showLoginSuccessAlert = false;

  constructor(private localStorage: LocalStorage, private router: Router, private authService: AuthService) {}
  ngAfterViewInit(): void {
    this.firstFocusableElement?.nativeElement.focus();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onLogin(form: NgForm): void {
    if (form.valid) {
      const users = this.localStorage.getItem<RegisteredUser[]>('users') || [];
      // First, validate that the identifier exists in registered users.
      const userExists = users.some(
        (registeredUser) =>
          registeredUser.email === this.user.identifier ||
          registeredUser.username === this.user.identifier
      );

      if (!userExists) {
        alert('You are not registered. Please sign up first.');
        return;
      }

      if (this.authService.login(this.user.identifier, this.user.password)) {
        console.log('Login Successful!');
        // Show a transient success alert, then redirect.
        this.showLoginSuccessAlert = true;
        window.setTimeout(() => {
          this.showLoginSuccessAlert = false;
          this.router.navigate(['/dashboard']);
        }, 1000);
      } else {
        alert('Invalid password. Please try again.');
        console.error('Invalid credentials.');
      }
    }
  }
}
