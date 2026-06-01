import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { ToastrService } from 'ngx-toastr';

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
  updatingStatus = false;
  statusFilter = '';

  readonly allStatuses = ['Pending', 'PaymentReceived', 'PaymentFailed', 'Shipped', 'Delivered'];

  get filteredOrders(): any[] {
    if (!this.statusFilter) return this.orders;
    return this.orders.filter(o => o.status === this.statusFilter);
  }

  constructor(private adminService: AdminService, private toast: ToastrService) {}

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

  openDetail(order: any) { this.detailOrder = { ...order }; }
  closeDetail() { this.detailOrder = null; }

  changeStatus(newStatus: string) {
    if (!this.detailOrder || this.updatingStatus) return;
    this.updatingStatus = true;
    this.adminService.updateOrderStatus(this.detailOrder.id, newStatus).subscribe({
      next: () => {
        this.detailOrder.status = newStatus;
        const idx = this.orders.findIndex(o => o.id === this.detailOrder.id);
        if (idx !== -1) this.orders[idx].status = newStatus;
        this.toast.success('Order status updated', 'Success');
        this.updatingStatus = false;
      },
      error: () => {
        this.toast.error('Failed to update status', 'Error');
        this.updatingStatus = false;
      },
    });
  }

  onPageChange(p: number) { this.page = p; this.load(); }
  get totalPages() { return Math.ceil(this.totalCount / this.pageSize); }
  get pages() { return Array.from({ length: this.totalPages }, (_, i) => i + 1); }

  exportCsv() {
    this.adminService.exportOrdersCsv().subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `orders_${new Date().toISOString().slice(0,10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        this.toast.success('Orders exported!', 'CSV');
      },
      error: () => this.toast.error('Export failed', 'Error')
    });
  }

  statusClass(status: string) {
    const map: Record<string, string> = {
      Pending:         'status-pending',
      PaymentReceived: 'status-success',
      PaymentFailed:   'status-failed',
      Shipped:         'status-shipped',
      Delivered:       'status-delivered',
    };
    return map[status] ?? 'status-pending';
  }

  statusLabel(status: string) {
    const map: Record<string, string> = {
      Pending:         'Pending',
      PaymentReceived: 'Paid',
      PaymentFailed:   'Failed',
      Shipped:         'Shipped',
      Delivered:       'Delivered',
    };
    return map[status] ?? status;
  }
}
