import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private base = environment.baseURL;

  constructor(private http: HttpClient) {}

  // ── Dashboard ──
  getStats()             { return this.http.get<any>(`${this.base}Admin/stats`,           { withCredentials: true }); }
  getMonthlySales()      { return this.http.get<any[]>(`${this.base}Admin/monthly-sales`,  { withCredentials: true }); }
  getTopProducts()       { return this.http.get<any[]>(`${this.base}Admin/top-products`,   { withCredentials: true }); }
  getCategoryBreakdown() { return this.http.get<any[]>(`${this.base}Admin/category-breakdown`, { withCredentials: true }); }
  getDailyOrders()       { return this.http.get<any[]>(`${this.base}Admin/daily-orders`,   { withCredentials: true }); }

  getLowStockProducts() {
    const params = new HttpParams().set('pageNumber', 1).set('pageSize', 200);
    return this.http.get<any>(`${this.base}Products/get-all`, { params, withCredentials: true });
  }

  // ── Products ──
  getProducts(page = 1, pageSize = 12) {
    const params = new HttpParams().set('pageNumber', page).set('pageSize', pageSize);
    return this.http.get<any>(`${this.base}Products/get-all`, { params, withCredentials: true });
  }
  addProduct(fd: FormData)    { return this.http.post(`${this.base}Products/add-Product`,   fd, { withCredentials: true }); }
  updateProduct(fd: FormData) { return this.http.put(`${this.base}Products/update-Product`, fd, { withCredentials: true }); }
  deleteProduct(id: number)   { return this.http.delete(`${this.base}Products/delete-Product/${id}`, { withCredentials: true }); }

  // ── Variants ──
  getProductVariants(productId: number) { return this.http.get<any[]>(`${this.base}ProductVariants/${productId}`, { withCredentials: true }); }
  addVariant(data: any)    { return this.http.post(`${this.base}ProductVariants`, data,  { withCredentials: true }); }
  deleteVariant(id: number){ return this.http.delete(`${this.base}ProductVariants/${id}`,{ withCredentials: true }); }

  // ── Categories ──
  getCategories()                                                              { return this.http.get<any[]>(`${this.base}Category/get-all`,          { withCredentials: true }); }
  addCategory(d: { name: string; description: string })                       { return this.http.post(`${this.base}Category/add-category`,    d,      { withCredentials: true }); }
  updateCategory(d: { id: number; name: string; description: string })        { return this.http.put(`${this.base}Category/update-category`,  d,      { withCredentials: true }); }
  deleteCategory(id: number)                                                   { return this.http.delete(`${this.base}Category/delete-category/${id}`, { withCredentials: true }); }

  // ── Orders ──
  getAllOrders(page = 1, pageSize = 10) {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<any>(`${this.base}Admin/orders`, { params, withCredentials: true });
  }
  updateOrderStatus(id: number, status: string) {
    return this.http.patch(`${this.base}Admin/orders/${id}/status`, { status }, { withCredentials: true });
  }
  exportOrdersCsv() {
    return this.http.get(`${this.base}Admin/orders/export`, { responseType: 'blob', withCredentials: true });
  }

  // ── Users ──
  getUsers()             { return this.http.get<any[]>(`${this.base}Admin/users`,    { withCredentials: true }); }
  deleteUser(id: string) { return this.http.delete(`${this.base}Admin/users/${id}`, { withCredentials: true }); }

  // ── Reviews ──
  getAllReviews()           { return this.http.get<any[]>(`${this.base}Admin/reviews`,    { withCredentials: true }); }
  deleteReview(id: number) { return this.http.delete(`${this.base}Admin/reviews/${id}`,  { withCredentials: true }); }

  // ── Returns ──
  getReturnRequests(status = '') {
    const params = status ? { status } : {};
    return this.http.get<any[]>(`${this.base}Admin/returns`, { params, withCredentials: true });
  }
  updateReturnStatus(id: number, status: string, adminNote: string) {
    return this.http.patch(`${this.base}Admin/returns/${id}`, { status, adminNote }, { withCredentials: true });
  }

  // ── Coupons ──
  getCoupons()             { return this.http.get<any[]>(`${this.base}Coupons`,          { withCredentials: true }); }
  addCoupon(data: any)     { return this.http.post(`${this.base}Coupons`,       data,    { withCredentials: true }); }
  deleteCoupon(id: number) { return this.http.delete(`${this.base}Coupons/${id}`,        { withCredentials: true }); }
}
