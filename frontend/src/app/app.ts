import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './navbar/navbar';
import { ToastComponent } from './toast/toast.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  get isLoginPage(): boolean {
    return location.pathname === '/login';
  }

  get isSignupPage(): boolean {
    return location.pathname === '/signup';
  }
}
