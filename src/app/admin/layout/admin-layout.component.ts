import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
})
export class AdminLayoutComponent {
  sidebarOpen = true;

  navItems = [
    { label: 'Dashboard',  icon: 'dashboard',    route: '/admin/dashboard'   },
    { label: 'Products',   icon: 'inventory_2',  route: '/admin/products'    },
    { label: 'Categories', icon: 'category',     route: '/admin/categories'  },
    { label: 'Orders',     icon: 'receipt_long', route: '/admin/orders'      },
  ];

  constructor(private router: Router) {}

  toggleSidebar() { this.sidebarOpen = !this.sidebarOpen; }
}
