import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';

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
  private baseUrl = 'http://localhost:8080/api/v1/auth'; // Common base URL
  private tokenKey = 'token';

  constructor(private http: HttpClient) {}
  
  private getToken(): string | null {
    return localStorage.getItem(this.tokenKey)
  }
  // Fetch all menu items
  getMenuItems(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(`${this.baseUrl}/menu`);
  }

  // Add an item to the cart for a specific user
  addToCart(menuItemId: number, userId: string, quantity: number = 1): Observable<any> {
    const cartItem = { menuItem: { id: menuItemId }, quantity };
    const token = this.getToken();
    if(!token) {
      console.log('token missing')
      return throwError(() => new Error('authorization token is missing'))
    }
    return this.http.post(`${this.baseUrl}/cart/add?userId=${userId}`, cartItem,{
      headers: new HttpHeaders({ Authorization: `Bearer ${token}`}),
    }).pipe(
      catchError((error) => {
        console.log('error adding to cart', error);
        return throwError(()=> error)
      })
    )
  }

  // Fetch all cart items for a specific user
  getCartItems(userId: string): Observable<CartItem[]> {
    const token = this.getToken();
    if(!token) {
      console.log('token missing')
      return throwError(() => new Error('authorization token is missing'))
    }
    return this.http.get<CartItem[]>(`${this.baseUrl}/cart?userId=${userId}`,{
    headers:  new HttpHeaders({ Authorization: `Bearer ${token}`}),
  }).pipe(
    catchError((error) => {
      console.log('error loading to cart', error);
      return throwError(()=> error)
    })
  )
}
}