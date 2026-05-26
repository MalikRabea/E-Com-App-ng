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

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.adminService.getStats().subscribe({
      next: (data) => { this.stats = data; this.loading = false; },
      error: () => { this.error = true; this.loading = false; }
    });
  }

  getStatusClass(status: string): string {
    if (status === 'PaymentReceived') return 'status-success';
    if (status === 'PaymentFaild')   return 'status-failed';
    return 'status-pending';
  }

  getStatusLabel(status: string): string {
    if (status === 'PaymentReceived') return 'Paid';
    if (status === 'PaymentFaild')   return 'Failed';
    return 'Pending';
  }

  getStatusIcon(status: string): string {
    if (status === 'PaymentReceived') return 'check_circle';
    if (status === 'PaymentFaild')   return 'cancel';
    return 'schedule';
  }
}
