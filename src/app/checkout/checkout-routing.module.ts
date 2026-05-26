import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckoutComponent } from './checkout/checkout.component';
import { SuccessComponent } from './success/success.component';
import  { authGuard } from '../guard/auth.guard';

const routes: Routes = [
  {path:'',component:CheckoutComponent, canActivate: [authGuard]},
  {path:'success',component:SuccessComponent , canActivate: [authGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckoutRoutingModule { }
