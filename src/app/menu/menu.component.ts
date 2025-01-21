import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { MenuItem, MenuService, CartItem } from '../menu.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  menuItems: MenuItem[] = [];
  cartItems: CartItem[] = [];
  userId: string | null = null;

  constructor(private menuService: MenuService, private authService: AuthService) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.loadMenuItems();
    if (this.userId) {
      this.loadCartItems();
    }
  }

  loadMenuItems(): void {
    this.menuService.getMenuItems().subscribe({
      next: (data) => {
        this.menuItems = data;
      },
      error: (err) => {
        console.error('Error fetching menu items:', err);
      },
    });
  }

  addToCart(menuItemId: number): void {
    if (!this.userId) {
      alert('You must log in to add items to the cart.');
      return;
    }

    this.menuService.addToCart(menuItemId, this.userId).subscribe({
      next: () => {
        alert('Item added to cart!');
        this.loadCartItems();
      },
      error: (err) => {
        console.error('Error adding item to cart:', err);
      },
    });
  }

  loadCartItems(): void {
    if (!this.userId) {
      console.warn('User is not logged in. Cannot load cart items.');
      return;
    }

    this.menuService.getCartItems(this.userId).subscribe({
      next: (data) => {
        this.cartItems = data;
      },
      error: (err) => {
        console.error('Error fetching cart items:', err);
      },
    });
  }

  updateCartItem(cartItemId: number, quantity: number): void {
    if (quantity <= 0) {
      alert('Quantity must be greater than zero.');
      return;
    }

    this.menuService.updateCartItem(cartItemId, quantity).subscribe({
      next: () => {
        alert('Cart item updated.');
        this.loadCartItems();
      },
      error: (err) => {
        console.error('Error updating cart item:', err);
      },
    });
  }

  removeCartItem(cartItemId: number): void {
    this.menuService.removeCartItem(cartItemId).subscribe({
      next: () => {
        alert('Item removed from cart.');
        this.loadCartItems();
      },
      error: (err) => {
        console.error('Error removing cart item:', err);
      },
    });
  }

  getCartTotal(): string {
    const total = this.cartItems.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
    return total.toFixed(2);
  }
}
