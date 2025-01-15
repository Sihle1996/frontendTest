import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { MenuItem, MenuService } from '../menu.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  menuItems: MenuItem[] = [];
  cartItems: any[] = [];
  userId: string | null = null;

  constructor(private menuService: MenuService, private authService: AuthService) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId(); // Retrieve user ID from the token
    this.loadMenuItems(); // Load products regardless of authentication
    if (this.userId) {
      this.loadCartItems(); // Load cart items only if user is logged in
    }
  }

  loadMenuItems(): void {
    this.menuService.getMenuItems().subscribe({
      next: (data) => {
        this.menuItems = data;
      },
      error: (err) => {
        console.error('Failed to load menu items', err);
      },
    });
  }

  addToCart(menuItemId: number): void {
    if (this.userId) {
      this.menuService.addToCart(menuItemId, this.userId).subscribe({
        next: () => {
          alert('Item added to cart successfully!');
          this.loadCartItems(); // Reload cart after adding item
        },
        error: (err) => {
          console.error('Failed to add item to cart', err);
          alert('Could not add item to cart. Please try again.');
        },
      });
    } else {
      alert('You must be logged in to add items to the cart.');
    }
  }

  loadCartItems(): void {
    if (this.userId) {
      this.menuService.getCartItems(this.userId).subscribe({
        next: (data) => {
          this.cartItems = data;
        },
        error: (err) => {
          console.error('Failed to load cart items', err);
        },
      });
    } else {
      console.warn('User is not logged in. Cart items cannot be loaded.');
    }
  }
}
