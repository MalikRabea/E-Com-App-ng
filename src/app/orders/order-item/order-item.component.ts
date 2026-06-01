import { Component, OnInit, OnDestroy, AfterViewChecked } from '@angular/core';
import { IOrder } from '../../shared/Models/Order';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdersService } from '../orders.service';
import { IRating } from '../../shared/Models/rating';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { SignalRService } from '../../core/Services/signalr.service';
import { CommerceService } from '../../core/Services/commerce.service';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';

@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html',
  styleUrl: './order-item.component.scss',
})
export class OrderItemComponent implements OnInit, OnDestroy, AfterViewChecked {
  order: IOrder | null = null;
  id: number = 0;
  loading = true;
  ratingOpen = false;
  returnOpen = false;
  imgUrl = environment.imageUrl;

  trackingPoints: any[] = [];
  private map: L.Map | null = null;
  private mapInitialized = false;

  rating: IRating = { productId: 0, content: '', stars: 0 };

  returnForm = { reason: '', description: '' };
  returnReasons = [
    'Wrong item received',
    'Defective / damaged item',
    'Changed my mind',
    'Item not as described',
    'Late delivery',
    'Other',
  ];

  private signalRSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private _service: OrdersService,
    private toast: ToastrService,
    private router: Router,
    private signalR: SignalRService,
    private http: HttpClient,
    private commerce: CommerceService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((param) => {
      this.id = param['id'];
    });

    if (this.id) {
      this._service.getCurrentOrderForUser(this.id).subscribe({
        next: (response) => {
          this.order = response;
          this.loading = false;
          this.signalR.startConnection(this.id);
          this.signalRSub = this.signalR.orderStatusUpdated$.subscribe(update => {
            if (update && this.order && update.orderId === this.order.id) {
              this.order.status = update.status;
              this.toast.info(`Order status updated: ${update.status}`, 'Live Update');
            }
          });
          this.loadTracking();
        },
        error: (err) => {
          this.loading = false;
          if (err.status === 401) {
            this.router.navigate(['/Account/Login'], {
              queryParams: { returnUrl: `/orders?id=${this.id}` },
            });
          }
        },
      });
    } else {
      this.loading = false;
    }
  }

  readonly trackingSteps = [
    { key: 'Pending',         label: 'Order Placed',  icon: 'receipt_long' },
    { key: 'PaymentReceived', label: 'Payment Received', icon: 'payments' },
    { key: 'Shipped',         label: 'Shipped',       icon: 'local_shipping' },
    { key: 'Delivered',       label: 'Delivered',     icon: 'done_all' },
  ];

  loadTracking() {
    this.commerce.getTracking(this.id).subscribe({
      next: (points) => {
        this.trackingPoints = points || [];
        this.mapInitialized = false; // trigger redraw
      },
      error: () => { this.trackingPoints = []; }
    });
  }

  ngAfterViewChecked(): void {
    if (this.trackingPoints.length > 0 && !this.mapInitialized) {
      const el = document.getElementById('tracking-map');
      if (el) {
        this.mapInitialized = true;
        setTimeout(() => this.renderMap(), 0);
      }
    }
  }

  private renderMap() {
    if (this.map) { this.map.remove(); this.map = null; }
    const pts = this.trackingPoints;
    if (pts.length === 0) return;

    const last = pts[pts.length - 1];
    this.map = L.map('tracking-map').setView([last.latitude, last.longitude], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 18,
    }).addTo(this.map);

    const latlngs: [number, number][] = pts.map(p => [p.latitude, p.longitude]);

    pts.forEach((p, i) => {
      const isLast = i === pts.length - 1;
      const icon = L.divIcon({
        className: 'tracking-marker',
        html: `<div class="tm-dot ${isLast ? 'tm-current' : ''}"><span class="material-icons">${isLast ? 'local_shipping' : 'check'}</span></div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });
      L.marker([p.latitude, p.longitude], { icon })
        .addTo(this.map!)
        .bindPopup(`<strong>${p.status}</strong><br/>${p.location}<br/><small>${new Date(p.timestamp).toLocaleString()}</small>`);
    });

    if (latlngs.length > 1) {
      L.polyline(latlngs, { color: '#2563eb', weight: 3, dashArray: '6 8' }).addTo(this.map);
      this.map.fitBounds(L.latLngBounds(latlngs).pad(0.3));
    }
  }

  getStepIndex(status: string): number {
    const map: Record<string, number> = {
      Pending: 0, PaymentReceived: 1, Shipped: 2, Delivered: 3, PaymentFailed: -1
    };
    return map[status] ?? 0;
  }

  openRatingModal(productId: number) {
    this.rating = { productId, content: '', stars: 0 };
    this.ratingOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeRatingModal() {
    this.ratingOpen = false;
    document.body.style.overflow = '';
  }

  submitRating() {
    this._service.addrating(this.rating).subscribe({
      next: () => {
        this.closeRatingModal();
        this.toast.success('Review submitted!', 'Thank you');
      },
      error: () => {
        this.closeRatingModal();
        this.toast.error('You already reviewed this product', 'Notice');
      },
    });
  }

  ngOnDestroy() {
    this.signalRSub?.unsubscribe();
    this.signalR.stopConnection();
    if (this.map) { this.map.remove(); this.map = null; }
  }

  printInvoice() {
    window.print();
  }

  openReturnModal() {
    this.returnForm = { reason: '', description: '' };
    this.returnOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeReturnModal() {
    this.returnOpen = false;
    document.body.style.overflow = '';
  }

  submitReturn() {
    if (!this.returnForm.reason) {
      this.toast.warning('Please select a reason', 'Required');
      return;
    }
    const payload = {
      orderId:     this.order?.id,
      reason:      this.returnForm.reason,
      description: this.returnForm.description,
    };
    this.http.post(`${environment.baseURL}ReturnRequest`, payload, { withCredentials: true }).subscribe({
      next: () => {
        this.closeReturnModal();
        this.toast.success("Return request submitted. We'll contact you within 24h.", 'Request Received');
      },
      error: () => {
        this.closeReturnModal();
        this.toast.error('Failed to submit return request. Please try again.', 'Error');
      }
    });
  }
}
