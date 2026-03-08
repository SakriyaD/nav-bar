import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private readonly authService = inject(AuthService);

  getUserRole(): string | null {
    const decodedToken = this.authService.decodeToken();
    return decodedToken ? decodedToken.role : null;
  }

  isUser(): boolean {
    return this.getUserRole() === 'user';
  }

  isAdmin(): boolean {
    // For now, all logged-in users are 'user'.
    // In a real app, roles would be assigned during signup/login by the backend.
    // For demonstration, let's assume 'admin' role if email is 'admin@example.com'
    const decodedToken = this.authService.decodeToken();
    return decodedToken && decodedToken.email === 'admin@example.com';
  }
}
