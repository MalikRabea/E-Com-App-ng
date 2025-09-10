import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Favorite, Product } from '../shared/Models/Favorites';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private apiUrl =environment.baseURL;
  private favoriteCount = new BehaviorSubject<number>(0);
  favoriteCount$ = this.favoriteCount.asObservable();

  constructor(private http: HttpClient) {}

addToFavorites(productId: number): Observable<any> {
  return this.http.post(`${this.apiUrl}Favorites/${productId}`, {}, { withCredentials: true });
}

getFavorites(): Observable<Product[]> {
  return this.http.get<Product[]>(`${this.apiUrl}Favorites`, { withCredentials: true });
}

removeFromFavorites(productId: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}Favorites/${productId}`, { withCredentials: true });
}


   setFavoriteCount(count: number) {
    this.favoriteCount.next(count);
  }

  incrementFavoriteCount() {
    this.favoriteCount.next(this.favoriteCount.value + 1);
  }

  decrementFavoriteCount() {
    this.favoriteCount.next(this.favoriteCount.value - 1);
  }
}
