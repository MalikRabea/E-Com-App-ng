import { Component, OnInit } from '@angular/core';
import { IOrder } from '../../shared/Models/Order';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdersService } from '../orders.service';
import { IRating } from '../../shared/Models/rating';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html',
  styleUrl: './order-item.component.scss',
})
export class OrderItemComponent implements OnInit {
  order: IOrder | null = null;
  id: number = 0;
  ratingOpen = false;
  imgUrl = environment.imageUrl;

  rating: IRating = { productId: 0, content: '', stars: 0 };

  constructor(
    private route: ActivatedRoute,
    private _service: OrdersService,
    private toast: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((param) => {
      this.id = param['id'];
    });

    if (this.id) {
      this._service.getCurrentOrderForUser(this.id).subscribe({
        next: (response) => (this.order = response),
        error: (err) => {
          if (err.status === 401) {
            this.router.navigate(['/Account/Login'], {
              queryParams: { returnUrl: `/orders?id=${this.id}` },
            });
          }
        },
      });
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
}
