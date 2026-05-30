import { Component, OnInit } from '@angular/core';
import { LoyaltyService } from '../../core/Services/loyalty.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-loyalty',
  templateUrl: './loyalty.component.html',
  styleUrl: './loyalty.component.scss'
})
export class LoyaltyComponent implements OnInit {
  data: any = null;
  loading = true;
  redeemAmount = 100;
  redeeming = false;

  constructor(private loyaltyService: LoyaltyService, private toast: ToastrService) {}

  ngOnInit() {
    this.loyaltyService.getMyPoints().subscribe({
      next: (d) => { this.data = d; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  get tierColor(): string {
    return { Bronze: '#cd7f32', Silver: '#94a3b8', Gold: '#f59e0b', Platinum: '#818cf8' }[this.data?.tier] || '#64748b';
  }

  get tierIcon(): string {
    return { Bronze: 'emoji_events', Silver: 'military_tech', Gold: 'workspace_premium', Platinum: 'diamond' }[this.data?.tier] || 'star';
  }

  get progressPercent(): number {
    if (!this.data) return 0;
    const thresholds: Record<string, [number, number]> = {
      Bronze: [0, 500], Silver: [500, 2000], Gold: [2000, 5000], Platinum: [5000, 5000]
    };
    const [min, max] = thresholds[this.data.tier] || [0, 500];
    if (max === min) return 100;
    return Math.min(100, ((this.data.points - min) / (max - min)) * 100);
  }

  redeem() {
    if (this.redeemAmount < 100 || this.redeemAmount > this.data?.points) return;
    this.redeeming = true;
    this.loyaltyService.redeemPoints(this.redeemAmount).subscribe({
      next: (res) => {
        this.toast.success(res.message, 'Points Redeemed!');
        this.data.points -= this.redeemAmount;
        this.redeeming = false;
      },
      error: (err) => {
        this.toast.error(err?.error?.message || 'Failed to redeem', 'Error');
        this.redeeming = false;
      }
    });
  }
}
