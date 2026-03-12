import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatStepperModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
  loading = signal(false);
  orderSuccess = signal(false);
  orderId = signal('');

  shippingForm = new FormGroup({
    fullName: new FormControl('', Validators.required),
    phone: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{10,11}$/)]),
    address: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    note: new FormControl(''),
  });

  constructor(
    public cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    if (this.cartService.cartItems().length === 0) {
      this.router.navigate(['/cart']);
    }
  }

  onSubmit() {
    if (this.shippingForm.invalid) {
      this.shippingForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const { fullName, phone, address, city, note } = this.shippingForm.value;

    const dto = {
      items: this.cartService.cartItems().map(item => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      shippingAddress: {
        fullName: fullName!,
        phone: phone!,
        address: address!,
        city: city!,
      },
      note: note || '',
    };

    this.orderService.createOrder(dto).subscribe({
      next: (order) => {
        this.loading.set(false);
        this.orderSuccess.set(true);
        this.orderId.set(order.id);
        this.cartService.clearCart();
      },
      error: (err) => {
        this.loading.set(false);
        this.snackBar.open(err.userMessage || 'Đặt hàng thất bại', 'Đóng', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      }
    });
  }
}