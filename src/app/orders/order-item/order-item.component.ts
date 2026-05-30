import { Component, OnInit, OnDestroy } from '@angular/core';
import { IOrder } from '../../shared/Models/Order';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdersService } from '../orders.service';
import { IRating } from '../../shared/Models/rating';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { SignalRService } from '../../core/Services/signalr.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html',
  styleUrl: './order-item.component.scss',
})
export class OrderItemComponent implements OnInit, OnDestroy {
  order: IOrder | null = null;
  id: number = 0;
  loading = true;
  ratingOpen = false;
  returnOpen = false;
  imgUrl = environment.imageUrl;

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
    private signalR: SignalRService
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
    const returns: any[] = JSON.parse(localStorage.getItem('returnRequests') || '[]');
    returns.push({
      orderId:     this.order?.id,
      reason:      this.returnForm.reason,
      description: this.returnForm.description,
      date:        new Date().toISOString(),
      status:      'Pending Review',
    });
    localStorage.setItem('returnRequests', JSON.stringify(returns));
    this.closeReturnModal();
    this.toast.success('Return request submitted. We\'ll contact you within 24h.', 'Request Received');
  }
}
