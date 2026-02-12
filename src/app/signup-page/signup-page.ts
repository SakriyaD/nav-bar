import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LocalStorage } from '../local-storage';
import { RouterLink } from "@angular/router"; 
import { TrapFocusDirective } from '../trap-focus.directive';

type RegisteredUser = {
  name: string;
  username: string;
  email: string;
  password: string;
};

@Component({
  selector: 'app-signup-page',
  imports: [FormsModule, CommonModule, RouterLink, TrapFocusDirective],
  template: `
    <div appTrapFocus class="container d-flex justify-content-center align-items-center vh-100">
      <div class="card shadow-lg p-4" style="max-width: 450px; width: 100%; border-radius: 15px;">
        <h3 class="fw-bold text-center mb-4">Sign Up</h3>

        <form #signupForm="ngForm" (ngSubmit)="onSignup(signupForm)">
          <div class="mb-3">
            <label class="form-label small fw-bold">Full Name</label>
            <input #firstFocusableElement type="text" name="fullName" class="form-control" [(ngModel)]="newUser.name" required #name="ngModel"
                  [class.is-invalid]="name.invalid && name.touched">
          </div>

          <div class="mb-3">
            <label class="form-label small fw-bold">Username</label>
            <input type="text" name="username" class="form-control" [(ngModel)]="newUser.username" required minlength="3" #username="ngModel"
                  [class.is-invalid]="username.invalid && username.touched">
          </div>

          <div class="mb-3">
            <label class="form-label small fw-bold">Email</label>
            <input type="email" name="email" class="form-control" [(ngModel)]="newUser.email" required email #sEmail="ngModel"
                  [class.is-invalid]="sEmail.invalid && sEmail.touched">
          </div>

          <div class="mb-3">
            <label class="form-label small fw-bold">Password</label>
            <div class="input-group">
              <input [type]="showPassword ? 'text' : 'password'" name="password" class="form-control" [(ngModel)]="newUser.password" required minlength="6" #sPwd="ngModel"
                    [class.is-invalid]="sPwd.invalid && sPwd.touched">
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
          </div>

          <div class="mb-3">
            <label class="form-label small fw-bold">Confirm Password</label>
            <div class="input-group">
              <input [type]="showConfirmPassword ? 'text' : 'password'" name="confirmPassword" class="form-control" [(ngModel)]="confirmPassword" required minlength="6" #confirmPwd="ngModel"
                    [class.is-invalid]="(confirmPwd.invalid && confirmPwd.touched) || (confirmPassword !== '' && confirmPassword !== newUser.password)">
              <button
                type="button"
                class="btn btn-outline-secondary"
                (click)="toggleConfirmPasswordVisibility()"
                [attr.aria-label]="showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'"
                [attr.aria-pressed]="showConfirmPassword"
              >
              <i [class]="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
            </div>
            @if (confirmPassword !== '' && confirmPassword !== newUser.password) {
              <div class="invalid-feedback d-block">Passwords do not match.</div>
            }
          </div>

          <button type="submit" class="btn btn-success w-100" [disabled]="signupForm.invalid || confirmPassword !== newUser.password">
            Register
          </button>
        </form>
        <p class="text-center mt-3 small">
          Already have an account? <a routerLink="/login" class="text-decoration-none">Sign In</a>
        </p>
      </div>
    </div>
  `,
  styleUrl: './signup-page.css',
})
export class SignupPage implements AfterViewInit {
  @ViewChild('firstFocusableElement') firstFocusableElement: ElementRef | undefined;

  // Signup stores username along with name/email/password.
  newUser = {
    name: '',
    username: '',
    email: '',
    password: ''
  };

  // Signup confirm-password validation and visibility toggles.
  confirmPassword = '';
  showPassword = false;
  showConfirmPassword = false;
  
  constructor(private localStorage: LocalStorage) {}
  ngAfterViewInit(): void {
    this.firstFocusableElement?.nativeElement.focus();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSignup(form: NgForm): void {
    if (form.valid) {
      //checks password and confirm password match
      if (this.newUser.password !== this.confirmPassword) {
        alert('Password and confirm password must match.');
        return;
      }

      const users = this.localStorage.getItem<RegisteredUser[]>('users') || [];
      // Check if user with this email already exists
      if (users.some((user) => user.email === this.newUser.email)) {
        alert('User with this email already exists.');
        return;
      }

      // Username uniqueness check supports login with username later.
      if (users.some((user) => user.username === this.newUser.username)) {
        alert('Username already exists. Please choose another username.');
        return;
      }

      users.push(this.newUser);
      this.localStorage.setItem('users', users);
      console.log('Signup Successful!', this.newUser);
      this.resetForm(form);
    }
  }

  resetForm(form: NgForm): void {
    form.reset();
    this.newUser = {
      name: '',
      username: '',
      email: '',
      password: ''
    };
    this.confirmPassword = '';
    this.showPassword = false;
    this.showConfirmPassword = false;
  }
}
