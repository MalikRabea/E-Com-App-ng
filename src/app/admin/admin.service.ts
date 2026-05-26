import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private base = environment.baseURL;

  constructor(private http: HttpClient) {}

  getStats() {
    return this.http.get<any>(`${this.base}Admin/stats`, { withCredentials: true });
  }

  getAllOrders(page = 1, pageSize = 10) {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<any>(`${this.base}Admin/orders`, { params, withCredentials: true });
  }

  // Products (use existing Products endpoints)
  getProducts(page = 1, pageSize = 12) {
    const params = new HttpParams().set('pageNumber', page).set('pageSize', pageSize);
    return this.http.get<any>(`${this.base}Products/get-all`, { params, withCredentials: true });
  }

  addProduct(formData: FormData) {
    return this.http.post(`${this.base}Products/add-Product`, formData, { withCredentials: true });
  }

  updateProduct(formData: FormData) {
    return this.http.put(`${this.base}Products/update-Product`, formData, { withCredentials: true });
  }

  deleteProduct(id: number) {
    return this.http.delete(`${this.base}Products/delete-Product/${id}`, { withCredentials: true });
  }

  // Categories (use existing Category endpoints)
  getCategories() {
    return this.http.get<any[]>(`${this.base}Category/get-all`, { withCredentials: true });
  }

  addCategory(data: { name: string; description: string }) {
    return this.http.post(`${this.base}Category/add-category`, data, { withCredentials: true });
  }

  updateCategory(data: { id: number; name: string; description: string }) {
    return this.http.put(`${this.base}Category/update-category`, data, { withCredentials: true });
  }

  deleteCategory(id: number) {
    return this.http.delete(`${this.base}Category/delete-category/${id}`, { withCredentials: true });
  }
}
