import { Component, OnInit } from '@angular/core';
import { CommerceService } from '../../core/Services/commerce.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrl: './subscriptions.component.scss'
})
export class SubscriptionsComponent implements OnInit {
  subs: any[] = [];
  loading = true;
  imgUrl = environment.imageUrl;

  constructor(private commerce: CommerceService, private toast: ToastrService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.commerce.mySubscriptions().subscribe({
      next: (data) => { this.subs = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  toggle(s: any) {
    this.commerce.toggleSubscription(s.id).subscribe({
      next: (res) => {
        s.isActive = res.isActive;
        this.toast.success(s.isActive ? 'Subscription resumed' : 'Subscription paused');
      },
      error: () => this.toast.error('Failed', 'Error')
    });
  }

  cancel(s: any) {
    this.commerce.cancelSubscription(s.id).subscribe({
      next: () => {
        this.subs = this.subs.filter(x => x.id !== s.id);
        this.toast.info('Subscription cancelled');
      },
      error: () => this.toast.error('Failed', 'Error')
    });
  }

  discountedPrice(s: any): number {
    return s.unitPrice * (1 - s.discountPercent / 100) * s.quantity;
  }
}
