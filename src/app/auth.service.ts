import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'token'; // Key for storing the token in localStorage
  private apiUrlAuth = 'http://localhost:8080/api'; // Base URL for authentication API
  private loggedIn = new BehaviorSubject<boolean>(this.isLoggedIn()); // BehaviorSubject for login state

  constructor(private http: HttpClient, private router: Router) {}

  /**
   * Observable to track the user's login state.
   */
  get isLoggedIn$(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  /**
   * Register a new user.
   */
  register(data: { email: string; password: string; confirmPassword: string }): Observable<any> {
    return this.http.post(`${this.apiUrlAuth}/register`, data);
  }

  /**
   * Login user with email and password.
   */
  login(credentials: { email: string; password: string }): Observable<{ token: string }> {
    console.log('Attempting login with credentials:', credentials);
    return this.http.post<{ token: string }>(`${this.apiUrlAuth}/login`, credentials);
  }

  /**
   * Save the JWT token to localStorage and update the login state.
   */
  saveToken(token: string): void {
    console.log('Saving token to localStorage:', token);
    localStorage.setItem(this.tokenKey, token);
    this.loggedIn.next(true);
    console.log('Token saved. Login state updated.');
  }

  /**
   * Retrieve the JWT token from localStorage.
   */
  getToken(): string | null {
    const token = localStorage.getItem(this.tokenKey);
    console.log('Retrieved token from localStorage:', token);
    return token;
  }

  /**
   * Clear the JWT token from localStorage and update the login state.
   */
  clearToken(): void {
    console.log('Clearing token from localStorage...');
    localStorage.removeItem(this.tokenKey);
    this.loggedIn.next(false);
    console.log('Token cleared. Login state updated.');
  }

  /**
   * Extract the user's ID from the JWT token.
   */
  getUserId(): string | null {
    const token = this.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Decoded JWT payload for user ID:', payload);
        return payload?.userId ? String(payload.userId) : null;
      } catch (error) {
        console.error('Error decoding token for user ID:', error);
      }
    }
    return null;
  }

  /**
   * Extract the roles of the user from the JWT token.
   */
  getRoles(): string[] {
    const token = this.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Decoded JWT payload for roles:', payload);
        return Array.isArray(payload.roles) ? payload.roles : payload.role ? [payload.role] : [];
      } catch (error) {
        console.error('Error decoding token for roles:', error);
      }
    }
    return [];
  }

  /**
   * Check if the user is logged in by verifying the presence of a token.
   */
  isLoggedIn(): boolean {
    const loggedIn = !!this.getToken();
    console.log('Checking login state:', loggedIn);
    return loggedIn;
  }

  /**
   * Logout the user by clearing the token and redirecting to the login page.
   */
  logout(): void {
    this.clearToken();
    console.log('User logged out. Redirecting to login page...');
    this.router.navigate(['/login']);
  }

  /**
   * Handle OAuth callback by saving the token and redirecting.
   */
  handleOAuthCallback(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      console.log('OAuth callback token received:', token);
      this.saveToken(token);
      this.router.navigate(['/main']); // Redirect to the main dashboard
    } else {
      console.error('No token found in the OAuth callback URL');
    }
  }
}
