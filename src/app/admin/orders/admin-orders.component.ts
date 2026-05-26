import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.scss'],
})
export class AdminOrdersComponent implements OnInit {
  orders: any[] = [];
  loading = true;
  totalCount = 0;
  page = 1;
  pageSize = 10;

  detailOrder: any = null;

  constructor(private adminService: AdminService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.adminService.getAllOrders(this.page, this.pageSize).subscribe({
      next: (res) => {
        this.orders = res.data ?? res;
        this.totalCount = res.totalCount ?? this.orders.length;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  openDetail(order: any) { this.detailOrder = order; }
  closeDetail() { this.detailOrder = null; }

  onPageChange(p: number) { this.page = p; this.load(); }
  get totalPages() { return Math.ceil(this.totalCount / this.pageSize); }
  get pages() { return Array.from({ length: this.totalPages }, (_, i) => i + 1); }

  statusClass(status: string) {
    const map: Record<string, string> = {
      Pending: 'status-pending',
      PaymentReceived: 'status-success',
      PaymentFailed: 'status-failed',
    };
    return map[status] ?? 'status-pending';
  }

  statusLabel(status: string) {
    const map: Record<string, string> = {
      Pending: 'Pending',
      PaymentReceived: 'Paid',
      PaymentFailed: 'Failed',
    };
    return map[status] ?? status;
  }
}
