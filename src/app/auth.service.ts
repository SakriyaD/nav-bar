import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorage } from './local-storage';

type RegisteredUser = {
  name: string;
  username: string;
  email: string;
  password: string;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly localStorage = inject(LocalStorage);
  private readonly router = inject(Router);
  private readonly TOKEN_KEY = 'jwt_token';

  // Simulates a backend login and token generation
  login(identifier: string, password: string): boolean {
    const users = this.localStorage.getItem<RegisteredUser[]>('users') || [];
    // Allows sign-in using either email or username from signup.
    const foundUser = users.find(
      (u) => (u.email === identifier || u.username === identifier) && u.password === password
    );

    if (foundUser) {
      // In a real app, this token would come from a backend.
      // For demonstration, we create a simple base64 encoded string.
      const payload = { email: foundUser.email, role: 'user' }; // Assuming a default role
      const token = btoa(JSON.stringify(payload)); // Simple base64 encoding
      this.localStorage.setItem(this.TOKEN_KEY, token);
      return true;
    }
    return false;
  }

  getToken(): string | null {
    return this.localStorage.getItem<string>(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    // In a real app, you would also check token expiration and validity
    return !!token;
  }

  logout(): void {
    this.localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/login']);
  }

  decodeToken(): any | null {
    const token = this.getToken();
    if (token) {
      try {
        return JSON.parse(atob(token)); // Simple base64 decoding
      } catch (e) {
        console.error('Error decoding token', e);
        return null;
      }
    }
    return null;
  }
}
