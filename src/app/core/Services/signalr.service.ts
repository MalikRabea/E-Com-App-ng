import { Injectable, OnDestroy } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface OrderStatusUpdate {
  orderId: number;
  status:  string;
}

@Injectable({ providedIn: 'root' })
export class SignalRService implements OnDestroy {
  private hub: signalR.HubConnection | null = null;
  private statusUpdate$ = new BehaviorSubject<OrderStatusUpdate | null>(null);

  orderStatusUpdated$ = this.statusUpdate$.asObservable();

  startConnection(orderId: number) {
    if (this.hub) this.stopConnection();

    this.hub = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.baseURL.replace('/api/', '')}/hubs/orders`, {
        withCredentials: true
      })
      .withAutomaticReconnect()
      .build();

    this.hub.on('OrderStatusUpdated', (data: OrderStatusUpdate) => {
      this.statusUpdate$.next(data);
    });

    this.hub.start()
      .then(() => this.hub!.invoke('JoinOrder', orderId.toString()))
      .catch(err => console.warn('SignalR connection failed:', err));
  }

  stopConnection() {
    if (this.hub) {
      this.hub.stop().catch(() => {});
      this.hub = null;
    }
  }

  ngOnDestroy() { this.stopConnection(); }
}
