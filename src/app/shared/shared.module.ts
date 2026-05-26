import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PagnationComponent } from './Component/pagnation/pagnation.component';
import { OrderTotalComponent } from './Component/order-total/order-total.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    PagnationComponent,
    OrderTotalComponent
  ],
  imports: [
    CommonModule,
    PaginationModule.forRoot(),
    RouterModule
  ],
  exports:[
    PaginationModule,
    PagnationComponent,
    OrderTotalComponent
  ]
})
export class SharedModule { }
