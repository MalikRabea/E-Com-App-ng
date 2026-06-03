import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BasketRoutingModule } from './basket-routing.module';
import { BasketComponent } from './basket/basket.component';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    BasketComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    BasketRoutingModule,
    SharedModule,
    TranslateModule
  ]
})
export class BasketModule { }
