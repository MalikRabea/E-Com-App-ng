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
    { label: 'Dashboard',  icon: 'dashboard',       route: '/admin/dashboard'   },
    { label: 'Analytics',  icon: 'bar_chart',        route: '/admin/analytics'   },
    { label: 'Products',   icon: 'inventory_2',      route: '/admin/products'    },
    { label: 'Categories', icon: 'category',         route: '/admin/categories'  },
    { label: 'Orders',     icon: 'receipt_long',     route: '/admin/orders'      },
    { label: 'Coupons',    icon: 'local_offer',      route: '/admin/coupons'     },
    { label: 'Users',      icon: 'people',           route: '/admin/users'       },
    { label: 'Reviews',    icon: 'rate_review',      route: '/admin/reviews'     },
    { label: 'Returns',    icon: 'assignment_return', route: '/admin/returns'     },
    { label: 'Support',    icon: 'support_agent',     route: '/admin/support'     },
    { label: 'Marketing',  icon: 'campaign',          route: '/admin/marketing'   },
    { label: 'Inventory',  icon: 'inventory',         route: '/admin/inventory'   },
  ];

  constructor(private router: Router) {}

  toggleSidebar() { this.sidebarOpen = !this.sidebarOpen; }
}
