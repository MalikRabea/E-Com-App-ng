import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShopComponent } from './shop/shop.component';
import { HomeComponent } from './home/home.component';
import { ProductDetailsComponent } from './shop/product-details/product-details.component';
import { authGuard } from './guard/auth.guard';
import { AboutComponent } from './about/about.component';
import { BestSellersComponent } from './best-sellers/best-sellers.component';
import { FavoriteComponent } from './favorite/favorite.component';
import { DeliveryComponent } from './checkout/delivery/delivery.component';
import { PrivacyPolicyComponent } from './home/privacy-policy/privacy-policy.component';
import { TermsConditionComponent } from './home/terms-condition/terms-condition.component';
import { DeliveryInfoComponent } from './home/delivery-info/delivery-info.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'shop',
    loadChildren: () => import('./shop/shop.module').then((m) => m.ShopModule), 
    
  },
  {
    path: 'basket',
    loadChildren: () => import('./basket/basket.module').then((m) => m.BasketModule), 
    
  },
  {
    path: 'checkout',
    loadChildren: () => import('./checkout/checkout.module').then((m) => m.CheckoutModule), 
    canActivate:[authGuard]
  },
  {
    path: 'Account',
    loadChildren: () => import('./identity/identity.module').then((m) => m.IdentityModule), 
    
  },
  {
    path: 'orders',
    loadChildren: () => import('./orders/orders.module').then((m) => m.OrdersModule), 
    canActivate:[authGuard]
  },
  
  { path: 'about', component: AboutComponent },

  { path: 'best-sellers', component: BestSellersComponent },

  { path: 'favorite', component: FavoriteComponent, canActivate:[authGuard] },

  {path: 'delivery-info', component:DeliveryInfoComponent},

  {path:'privacy-policy',component:PrivacyPolicyComponent},

  {path:'terms-conditions',component:TermsConditionComponent},


  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
