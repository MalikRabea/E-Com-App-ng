import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SupportService {
  private base = environment.baseURL;

  constructor(private http: HttpClient) {}

  // ── Tickets ──
  createTicket(subject: string, category: string, message: string) {
    return this.http.post<any>(`${this.base}Support`, { subject, category, message }, { withCredentials: true });
  }
  myTickets()           { return this.http.get<any[]>(`${this.base}Support/my`, { withCredentials: true }); }
  ticketThread(id: number) { return this.http.get<any>(`${this.base}Support/${id}`, { withCredentials: true }); }
  reply(id: number, body: string) { return this.http.post(`${this.base}Support/${id}/reply`, { body }, { withCredentials: true }); }

  // Admin
  allTickets(status = '')   { const params = status ? { status } : {}; return this.http.get<any[]>(`${this.base}Support/admin/all`, { params, withCredentials: true }); }
  setTicketStatus(id: number, status: string) { return this.http.patch(`${this.base}Support/${id}/status`, { status }, { withCredentials: true }); }

  // ── FAQ ──
  getFaqs()             { return this.http.get<any[]>(`${this.base}Faq`); }
  getFaqsAdmin()        { return this.http.get<any[]>(`${this.base}Faq/admin`, { withCredentials: true }); }
  addFaq(item: any)     { return this.http.post(`${this.base}Faq`, item, { withCredentials: true }); }
  updateFaq(id: number, item: any) { return this.http.put(`${this.base}Faq/${id}`, item, { withCredentials: true }); }
  deleteFaq(id: number) { return this.http.delete(`${this.base}Faq/${id}`, { withCredentials: true }); }

  // ── 2FA ──
  twoFactorStatus()     { return this.http.get<any>(`${this.base}TwoFactor/status`, { withCredentials: true }); }
  toggleTwoFactor()     { return this.http.post<any>(`${this.base}TwoFactor/toggle`, {}, { withCredentials: true }); }
  sendOtp(email: string){ return this.http.post<any>(`${this.base}TwoFactor/send-otp`, { email }); }
  verifyOtp(email: string, code: string) { return this.http.post<any>(`${this.base}TwoFactor/verify-otp`, { email, code }, { withCredentials: true }); }

  // ── Referrals ──
  myReferral()          { return this.http.get<any>(`${this.base}Referral/my`, { withCredentials: true }); }
  trackReferral(code: string, email: string) { return this.http.post(`${this.base}Referral/track`, { code, email }); }
  completeReferral()    { return this.http.post<any>(`${this.base}Referral/complete`, {}, { withCredentials: true }); }

  // ── Admin: campaigns + inventory ──
  getSegments()         { return this.http.get<any>(`${this.base}Admin/segments`, { withCredentials: true }); }
  sendCampaign(subject: string, body: string, segment: string) { return this.http.post<any>(`${this.base}Admin/campaigns/send`, { subject, body, segment }, { withCredentials: true }); }
  getCampaigns()        { return this.http.get<any[]>(`${this.base}Admin/campaigns`, { withCredentials: true }); }

  getInventoryMovements(productId?: number) { const params: any = productId ? { productId } : {}; return this.http.get<any[]>(`${this.base}Admin/inventory/movements`, { params, withCredentials: true }); }
  getReorderAlerts()    { return this.http.get<any[]>(`${this.base}Admin/inventory/reorder-alerts`, { withCredentials: true }); }
  restock(productId: number, amount: number, reason?: string) { return this.http.post<any>(`${this.base}Admin/inventory/restock`, { productId, amount, reason }, { withCredentials: true }); }
}
