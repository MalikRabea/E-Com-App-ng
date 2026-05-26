import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminRoutingModule } from './admin-routing.module';

import { AdminLayoutComponent } from './layout/admin-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminProductsComponent } from './products/products.component';
import { AdminCategoriesComponent } from './categories/categories.component';
import { AdminOrdersComponent } from './orders/admin-orders.component';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    DashboardComponent,
    AdminProductsComponent,
    AdminCategoriesComponent,
    AdminOrdersComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    AdminRoutingModule,
  ],
})
export class AdminModule {}
