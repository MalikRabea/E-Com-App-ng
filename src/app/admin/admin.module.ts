import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminRoutingModule } from './admin-routing.module';

import { AdminLayoutComponent }     from './layout/admin-layout.component';
import { AdminDashboardComponent }  from './dashboard/dashboard.component';
import { AdminProductsComponent }   from './products/products.component';
import { AdminCategoriesComponent } from './categories/categories.component';
import { AdminOrdersComponent }     from './orders/admin-orders.component';
import { AdminUsersComponent }      from './users/admin-users.component';
import { AdminReviewsComponent }    from './reviews/admin-reviews.component';
import { AdminAnalyticsComponent }  from './analytics/analytics.component';
import { AdminCouponsComponent }    from './coupons/admin-coupons.component';
import { AdminReturnsComponent }    from './returns/admin-returns.component';
import { AdminSupportComponent }    from './support/admin-support.component';
import { AdminMarketingComponent }  from './marketing/admin-marketing.component';
import { AdminInventoryComponent }  from './inventory/admin-inventory.component';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    AdminDashboardComponent,
    AdminProductsComponent,
    AdminCategoriesComponent,
    AdminOrdersComponent,
    AdminUsersComponent,
    AdminReviewsComponent,
    AdminAnalyticsComponent,
    AdminCouponsComponent,
    AdminReturnsComponent,
    AdminSupportComponent,
    AdminMarketingComponent,
    AdminInventoryComponent,
  ],
  imports: [CommonModule, FormsModule, RouterModule, AdminRoutingModule],
})
export class AdminModule {}
