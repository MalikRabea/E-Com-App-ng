import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { OrderComponent } from './order/order.component';
import { OrderItemComponent } from './order-item/order-item.component';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    OrderComponent,
    OrderItemComponent
  ],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    FormsModule,
    TranslateModule
  ]
})
export class OrdersModule { }
