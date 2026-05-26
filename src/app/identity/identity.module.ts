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


@NgModule({
  declarations: [
    RegisterComponent,
    ActiveComponent,
    LoginComponent,
    ResetPasswordComponent,
    LogoutComponent,
    ChangePasswordComponent,
    ProfileComponent,
    AddressBookComponent,
  ],
  imports: [
    CommonModule,
    IdentityRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class IdentityModule { }
