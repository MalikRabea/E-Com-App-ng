import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminProductsComponent } from './products/products.component';
import { AdminCategoriesComponent } from './categories/categories.component';
import { AdminOrdersComponent } from './orders/admin-orders.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'products', component: AdminProductsComponent },
      { path: 'categories', component: AdminCategoriesComponent },
      { path: 'orders', component: AdminOrdersComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
