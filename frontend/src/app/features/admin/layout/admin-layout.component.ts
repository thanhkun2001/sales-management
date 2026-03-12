import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
  ],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {
  menuItems = [
    { label: 'Dashboard', icon: 'dashboard', path: '/admin' },
    { label: 'Sản phẩm', icon: 'inventory_2', path: '/admin/products' },
    { label: 'Đơn hàng', icon: 'receipt_long', path: '/admin/orders' },
  ];

  constructor(public authService: AuthService, private router: Router) {}

  onLogout() {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login'])
    });
  }
}