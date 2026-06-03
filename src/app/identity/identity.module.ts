import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IdentityRoutingModule } from './identity-routing.module';
import { RegisterComponent } from './register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    RegisterComponent, ActiveComponent, LoginComponent, ResetPasswordComponent,
    LogoutComponent, ChangePasswordComponent, ProfileComponent, AddressBookComponent,
    LoyaltyComponent, GiftCardsComponent, SubscriptionsComponent, ReferralComponent,
  ],
  imports: [CommonModule, IdentityRoutingModule, ReactiveFormsModule, FormsModule, TranslateModule]
})
export class IdentityModule { }
