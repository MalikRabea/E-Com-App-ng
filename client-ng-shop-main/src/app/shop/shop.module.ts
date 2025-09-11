import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopComponent } from './shop.component';
import { ShopItemComponent } from './shop-item/shop-item.component';
import { SharedModule } from '../shared/shared.module';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { ShopRoutingModule } from './shop-routing.module';
import { FormsModule } from '@angular/forms';





@NgModule({
  declarations: [
    ShopComponent,
    ShopItemComponent,
    ProductDetailsComponent
  ],
  imports: [
    ShopRoutingModule,
    CommonModule,
    SharedModule,
    NgxImageZoomModule,
    FormsModule
  ],
  exports:[
   
  ]
})
export class ShopModule { }
