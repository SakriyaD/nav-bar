import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
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
