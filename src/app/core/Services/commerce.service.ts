import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CommerceService {
  private base = environment.baseURL;

  constructor(private http: HttpClient) {}

  // ── Gift Cards ──
  purchaseGiftCard(amount: number, recipientEmail?: string, message?: string) {
    return this.http.post<any>(`${this.base}GiftCards/purchase`,
      { amount, recipientEmail, message }, { withCredentials: true });
  }
  checkGiftCardBalance(code: string) {
    return this.http.get<any>(`${this.base}GiftCards/balance/${code}`);
  }
  redeemGiftCard(code: string, amount: number) {
    return this.http.post<any>(`${this.base}GiftCards/redeem`, { code, amount }, { withCredentials: true });
  }
  myGiftCards() {
    return this.http.get<any[]>(`${this.base}GiftCards/my`, { withCredentials: true });
  }

  // ── Subscriptions ──
  createSubscription(productId: number, quantity: number, interval: string) {
    return this.http.post<any>(`${this.base}Subscriptions`,
      { productId, quantity, interval }, { withCredentials: true });
  }
  mySubscriptions() {
    return this.http.get<any[]>(`${this.base}Subscriptions/my`, { withCredentials: true });
  }
  toggleSubscription(id: number) {
    return this.http.patch<any>(`${this.base}Subscriptions/${id}/toggle`, {}, { withCredentials: true });
  }
  cancelSubscription(id: number) {
    return this.http.delete(`${this.base}Subscriptions/${id}`, { withCredentials: true });
  }

  // ── Order Tracking ──
  getTracking(orderId: number) {
    return this.http.get<any[]>(`${this.base}OrderTracking/${orderId}`);
  }

  // ── Recommendations ──
  frequentlyBought(productId: number, count = 4) {
    return this.http.get<any[]>(`${this.base}Recommendations/frequently-bought/${productId}?count=${count}`);
  }
  recommendedForUser(email: string, count = 6) {
    return this.http.get<any[]>(`${this.base}Recommendations/for-user/${encodeURIComponent(email)}?count=${count}`);
  }
}
