import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent }     from './layout/admin-layout.component';
import { AdminDashboardComponent }  from './dashboard/dashboard.component';
import { AdminProductsComponent }   from './products/products.component';
import { AdminCategoriesComponent } from './categories/categories.component';
import { AdminOrdersComponent }     from './orders/admin-orders.component';
import { AdminUsersComponent }      from './users/admin-users.component';
import { AdminReviewsComponent }    from './reviews/admin-reviews.component';
import { AdminAnalyticsComponent }  from './analytics/analytics.component';
import { AdminCouponsComponent }    from './coupons/admin-coupons.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '',           redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard',  component: AdminDashboardComponent  },
      { path: 'products',   component: AdminProductsComponent   },
      { path: 'categories', component: AdminCategoriesComponent },
      { path: 'orders',     component: AdminOrdersComponent     },
      { path: 'users',      component: AdminUsersComponent      },
      { path: 'reviews',    component: AdminReviewsComponent    },
      { path: 'analytics',  component: AdminAnalyticsComponent  },
      { path: 'coupons',    component: AdminCouponsComponent    },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
