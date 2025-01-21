import { Component } from '@angular/core';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-admindashboard',
  templateUrl: './admindashboard.component.html',
  styleUrls: ['./admindashboard.component.scss']
})
export class AdmindashboardComponent {
  orders: any[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.orderService.getAllOrders().subscribe(
      (data) => {
        this.orders = data;
        console.log('Orders fetched:', this.orders);
      },
      (error) => {
        console.error('Error fetching orders:', error);
      }
    );
  }
}
