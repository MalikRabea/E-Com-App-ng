import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PushNotificationService {
  private base = environment.baseURL + 'Push';

  constructor(private http: HttpClient) {}

  getVapidKey() {
    return this.http.get<{ publicKey: string }>(`${this.base}/vapid-public-key`);
  }

  async subscribe(): Promise<boolean> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return false;

    try {
      const keyRes = await this.getVapidKey().toPromise();
      if (!keyRes?.publicKey) return false;

      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly:      true,
        applicationServerKey: this.urlBase64ToUint8Array(keyRes.publicKey)
      });

      const subJson: any = sub.toJSON();
      await this.http.post(`${this.base}/subscribe`, {
        endpoint: sub.endpoint,
        p256dh:   subJson.keys?.p256dh || '',
        auth:     subJson.keys?.auth   || ''
      }, { withCredentials: true }).toPromise();

      return true;
    } catch { return false; }
  }

  async unsubscribe(): Promise<void> {
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await this.http.delete(`${this.base}/unsubscribe`,
          { body: { endpoint: sub.endpoint }, withCredentials: true }).toPromise();
        await sub.unsubscribe();
      }
    } catch { }
  }

  isSupported(): boolean {
    return 'serviceWorker' in navigator && 'PushManager' in window;
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding   = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64    = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData   = window.atob(base64);
    const outputArr = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; i++) outputArr[i] = rawData.charCodeAt(i);
    return outputArr;
  }
}
