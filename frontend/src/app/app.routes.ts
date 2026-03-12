import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Auth
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component')
      .then(c => c.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component')
      .then(c => c.RegisterComponent)
  },
  {
    path: '',
    loadComponent: () => import('./shared/components/layout/layout.component')
      .then(c => c.LayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/shop/product-list/product-list.component')
          .then(c => c.ProductListComponent)
      },
      {
        path: 'products',
        loadComponent: () => import('./features/shop/product-list/product-list.component')
          .then(c => c.ProductListComponent)
      },
      {
        path: 'products/:id',
        loadComponent: () => import('./features/shop/product-detail/product-detail.component')
          .then(c => c.ProductDetailComponent)
      },
      {
        path: 'cart',
        canActivate: [authGuard],
        loadComponent: () => import('./features/shop/cart/cart.component')
          .then(c => c.CartComponent)
      },
      {
        path: 'checkout',
        canActivate: [authGuard],
        loadComponent: () => import('./features/checkout/checkout.component')
          .then(c => c.CheckoutComponent)
      },
      {
        path: 'orders',
        canActivate: [authGuard],
        loadComponent: () => import('./features/shop/orders/orders.component')
          .then(c => c.OrdersComponent)
      },
      {
        path: 'admin',
        canActivate: [authGuard, adminGuard],
        loadComponent: () => import('./features/admin/layout/admin-layout.component')
          .then(c => c.AdminLayoutComponent),
        children: [
          {
            path: '',
            loadComponent: () => import('./features/admin/dashboard/dashboard.component')
              .then(c => c.DashboardComponent)
          },
          {
            path: 'products',
            loadComponent: () => import('./features/admin/products/products.component')
              .then(c => c.AdminProductsComponent)
          },
          {
            path: 'orders',
            loadComponent: () => import('./features/admin/orders/orders.component')
              .then(c => c.AdminOrdersComponent)
          },
        ]
      },
    ]
  },
 
  { path: '**', redirectTo: '' }
];