import { environment } from './../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActiveAccount } from '../shared/Models/ActiveAccount';
import { ResetPassword } from '../shared/Models/ResetPassowrd';

@Injectable({
  providedIn: 'root'
})
export class IdentityService {
  baseURL=environment.baseURL
  constructor(private http:HttpClient) { }
  register(form:any){
    return this.http.post(this.baseURL+"Account/Register",form)
  }
  active(param:ActiveAccount){
    return this.http.post(this.baseURL+"Account/active-account",param)
  }
  Login(form:any){
    return this.http.post(this.baseURL+"Account/Login",form)
  }
  forgetPassword(email:string){
    return this.http.get(this.baseURL+`Account/send-email-forget-password?email=${email}`)
  }
  ResetPassword(param:ResetPassword){
   return this.http.post(this.baseURL+"Account/reset-password",param)
  } 
  Logout() {
  return this.http.post(this.baseURL + "Account/Logout", {}, { withCredentials: true });
}     
}
