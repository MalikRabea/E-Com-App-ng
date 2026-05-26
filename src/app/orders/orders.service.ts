import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { IOrder } from '../shared/Models/Order';
import { IRating } from '../shared/Models/rating';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  constructor(private http: HttpClient) {}
  BaseURl = environment.baseURL;
  getCurrentOrderForUser(id:number){
    return this.http.get<IOrder>(this.BaseURl+"Orders/get-order-by-id/"+id, { withCredentials: true })
  }
  getAllOrderForUser(){
    return this.http.get<IOrder[]>(this.BaseURl+"Orders/get-orders-for-user", { withCredentials: true })
  }
  addrating(rate:IRating){
    return this.http.post(this.BaseURl+"Ratings/add-rating",rate, { withCredentials: true })
  }
}
