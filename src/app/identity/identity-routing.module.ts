import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { ActiveComponent } from './active/active.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { LogoutComponent } from './logout/logout.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ProfileComponent } from './profile/profile.component';
import { AddressBookComponent } from './address-book/address-book.component';
import { LoyaltyComponent } from './loyalty/loyalty.component';
import { GiftCardsComponent } from './gift-cards/gift-cards.component';
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';
import { ReferralComponent } from './referral/referral.component';

const routes: Routes = [
  { path: 'Register',       component: RegisterComponent },
  { path: 'active',         component: ActiveComponent },
  { path: 'Login',          component: LoginComponent },
  { path: 'Reset-Password', component: ResetPasswordComponent },
  { path: 'Logout',         component: LogoutComponent },
  { path: 'change-password',component: ChangePasswordComponent },
  { path: 'profile',        component: ProfileComponent },
  { path: 'addresses',      component: AddressBookComponent },
  { path: 'loyalty',        component: LoyaltyComponent },
  { path: 'gift-cards',     component: GiftCardsComponent },
  { path: 'subscriptions',  component: SubscriptionsComponent },
  { path: 'referral',       component: ReferralComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IdentityRoutingModule { }
