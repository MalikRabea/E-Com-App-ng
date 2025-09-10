import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IRating } from '../shared/Models/rating';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  baseURL = environment.baseURL;

  constructor(private http: HttpClient) {}

  getRatings(productId: number): Observable<IRating[]> {
    return this.http.get<IRating[]>(`${this.baseURL}/get-rating/${productId}`, { withCredentials: true });
  }

  addRating(rating: IRating): Observable<any> {
    return this.http.post(`${this.baseURL}/add-rating`, rating, { withCredentials: true });
  }
}
