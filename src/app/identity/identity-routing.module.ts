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

const routes: Routes = [
  {path:'Register',component:RegisterComponent},
  {path:'active',component:ActiveComponent},
  {path:'Login',component:LoginComponent},
  {path:'Reset-Password',component:ResetPasswordComponent},
  {path:'Logout',component:LogoutComponent},
  {path:'change-password',component:ChangePasswordComponent},
  {path:'profile',component:ProfileComponent},
  {path:'addresses',component:AddressBookComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IdentityRoutingModule { }
