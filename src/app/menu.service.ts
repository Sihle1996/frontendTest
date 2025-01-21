import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  description: string;
}

export interface CartItem {
  id: number;
  menuItem: MenuItem;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private baseUrl = 'http://localhost:8080/api'; // Common base URL

  constructor(private http: HttpClient) {}

  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    if (!token) {
      throw new Error('Authorization token is missing.');
    }
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getMenuItems(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(`${this.baseUrl}/menu`).pipe(
      catchError((error) => {
        console.error('Error fetching menu items:', error);
        return throwError(() => error);
      })
    );
  }

  addToCart(menuItemId: number, userId: string, quantity: number = 1): Observable<any> {
    const payload = { userId, menuItemId, quantity };
    return this.http.post(`${this.baseUrl}/cart/add`, payload, {
      headers: this.getAuthHeaders(),
    }).pipe(
      catchError((error) => {
        console.error('Error adding item to cart:', error);
        return throwError(() => error);
      })
    );
  }

  getCartItems(userId: string): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(`${this.baseUrl}/cart`, {
      headers: this.getAuthHeaders(),
      params: { userId },
    }).pipe(
      catchError((error) => {
        console.error('Error fetching cart items:', error);
        return throwError(() => error);
      })
    );
  }

  updateCartItem(cartItemId: number, quantity: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/cart/update/${cartItemId}`, { quantity }, {
      headers: this.getAuthHeaders(),
    }).pipe(
      catchError((error) => {
        console.error('Error updating cart item:', error);
        return throwError(() => error);
      })
    );
  }

  removeCartItem(cartItemId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/cart/delete/${cartItemId}`, {
      headers: this.getAuthHeaders(),
    }).pipe(
      catchError((error) => {
        console.error('Error removing cart item:', error);
        return throwError(() => error);
      })
    );
  }
}
