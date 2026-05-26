import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  stats: any = null;
  loading = true;
  error = false;

  monthlySales: any[] = [];
  maxRevenue = 1;

  readonly monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.adminService.getStats().subscribe({
      next: (data) => { this.stats = data; this.loading = false; },
      error: () => { this.error = true; this.loading = false; }
    });
    this.adminService.getMonthlySales().subscribe({
      next: (data) => {
        this.monthlySales = data;
        this.maxRevenue = Math.max(...data.map((d: any) => d.revenue), 1);
      }
    });
  }

  getBarHeight(revenue: number): number {
    return Math.max((revenue / this.maxRevenue) * 85, 4);
  }

  getMonthName(month: number): string {
    return this.monthNames[month - 1] ?? '';
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      PaymentReceived: 'status-success',
      PaymentFailed:   'status-failed',
      Shipped:         'status-shipped',
      Delivered:       'status-delivered',
    };
    return map[status] ?? 'status-pending';
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      Pending:         'Pending',
      PaymentReceived: 'Paid',
      PaymentFailed:   'Failed',
      Shipped:         'Shipped',
      Delivered:       'Delivered',
    };
    return map[status] ?? status;
  }

  getStatusIcon(status: string): string {
    const map: Record<string, string> = {
      PaymentReceived: 'check_circle',
      PaymentFailed:   'cancel',
      Shipped:         'local_shipping',
      Delivered:       'done_all',
    };
    return map[status] ?? 'schedule';
  }
}
