import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CommercialService {
  private base = environment.baseURL;

  constructor(private http: HttpClient) {}

  // ── Bundles ──
  getBundles()                 { return this.http.get<any[]>(`${this.base}Bundles`); }
  getBundle(id: number)        { return this.http.get<any>(`${this.base}Bundles/${id}`); }
  bundlesForProduct(pid: number) { return this.http.get<any[]>(`${this.base}Bundles/for-product/${pid}`); }
  // admin
  getBundlesAdmin()            { return this.http.get<any[]>(`${this.base}Bundles/admin/all`, { withCredentials: true }); }
  createBundle(data: any)      { return this.http.post(`${this.base}Bundles`, data, { withCredentials: true }); }
  deleteBundle(id: number)     { return this.http.delete(`${this.base}Bundles/${id}`, { withCredentials: true }); }

  // ── Tiered Pricing ──
  getTiers(productId: number)  { return this.http.get<any>(`${this.base}PriceTiers/${productId}`); }
  priceForQty(productId: number, qty: number) { return this.http.get<any>(`${this.base}PriceTiers/${productId}/price?qty=${qty}`); }
  addTier(data: any)           { return this.http.post(`${this.base}PriceTiers`, data, { withCredentials: true }); }
  deleteTier(id: number)       { return this.http.delete(`${this.base}PriceTiers/${id}`, { withCredentials: true }); }

  // ── Stock Reservation ──
  available(productId: number, basketId?: string) {
    const q = basketId ? `?basketId=${basketId}` : '';
    return this.http.get<any>(`${this.base}StockReservation/available/${productId}${q}`);
  }
  reserve(productId: number, basketId: string, quantity: number) {
    return this.http.post<any>(`${this.base}StockReservation/reserve`, { productId, basketId, quantity });
  }
  release(basketId: string) {
    return this.http.post(`${this.base}StockReservation/release`, { basketId });
  }

  // ── Analytics (admin) ──
  customerLtv()  { return this.http.get<any>(`${this.base}Admin/customer-ltv`, { withCredentials: true }); }
  cohorts()      { return this.http.get<any[]>(`${this.base}Admin/cohorts`, { withCredentials: true }); }
}
