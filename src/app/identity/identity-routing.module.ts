import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { ActiveComponent } from './active/active.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { LogoutComponent } from './logout/logout.component';

const routes: Routes = [
  {path:'Register',component:RegisterComponent},
  {path:'active',component:ActiveComponent},
  {path:'Login',component:LoginComponent},
  {path:'Reset-Password',component:ResetPasswordComponent},
  {path:'Logout',component:LogoutComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IdentityRoutingModule { }
