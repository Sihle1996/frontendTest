import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private adminOrdersUrl = 'http://localhost:8080/api/admin/orders'; // Admin orders API endpoint

  constructor(private http: HttpClient) {}

  getAllOrders(): Observable<any> {
    return this.http.get<any>(this.adminOrdersUrl);
  }
}
