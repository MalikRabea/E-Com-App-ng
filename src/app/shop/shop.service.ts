import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPagnation } from '../shared/Models/Pagnation';
import { ICategory } from '../shared/Models/Category';
import { ProductParam } from '../shared/Models/ProductParam';
import { IProduct } from '../shared/Models/Product';
import { environment } from '../../environments/environment.development';
import { IReview } from '../shared/Models/review';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  constructor(private http: HttpClient) {}

  baseURL = environment.baseURL;

  getProduct(productParam: ProductParam) {
    let param = new HttpParams();
    if (productParam.CategoryId) {
      param = param.append('categoryId', productParam.CategoryId);
    }
    if (productParam.SortSelected) {
      param = param.append('Sort', productParam.SortSelected);
    }
    if (productParam.search) {
      param = param.append('Search', productParam.search);
    }
    param = param.append('pageNumber', productParam.pageNumber);
    param = param.append('pageSize', productParam.pageSize);
    return this.http.get<IPagnation>(this.baseURL + 'Products/get-all', {
      params: param,
    });
  }
  getCategory() {
    return this.http.get<ICategory[]>(this.baseURL + 'Category/get-all');
  }
  getProductDetails(id: number) {
    return this.http.get<IProduct>(this.baseURL + 'Products/get-by-id/' + id);
  }
  getProductRating(id: number) {
    return this.http.get<IReview[]>(this.baseURL + 'Ratings/get-rating/' + id);
  }
  getBestSellers() {
  return this.http.get<IProduct[]>(this.baseURL + 'Products/best-sellers');
}
}
