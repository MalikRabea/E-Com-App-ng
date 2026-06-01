import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-coupons',
  templateUrl: './admin-coupons.component.html',
  styleUrls: ['./admin-coupons.component.scss'],
})
export class AdminCouponsComponent implements OnInit {
  coupons: any[] = [];
  loading = true;
  modalOpen = false;
  deleteId: number | null = null;

  form = {
    code: '',
    discountPercent: 10,
    maxUses: 100,
    expiryDate: '',
    isActive: true,
  };

  constructor(private svc: AdminService, private toast: ToastrService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.svc.getCoupons().subscribe({
      next: (data) => { this.coupons = data; this.loading = false; },
      error: () => (this.loading = false),
    });
  }

  openAdd() {
    this.form = { code: '', discountPercent: 10, maxUses: 100, expiryDate: '', isActive: true };
    this.modalOpen = true;
  }

  save() {
    const payload = {
      ...this.form,
      expiryDate: this.form.expiryDate ? new Date(this.form.expiryDate).toISOString() : null,
    };
    this.svc.addCoupon(payload).subscribe({
      next: () => { this.toast.success('Coupon created!', 'Success'); this.modalOpen = false; this.load(); },
      error: () => this.toast.error('Failed to create coupon', 'Error'),
    });
  }

  confirmDelete(id: number) { this.deleteId = id; }
  cancelDelete() { this.deleteId = null; }

  doDelete() {
    if (!this.deleteId) return;
    this.svc.deleteCoupon(this.deleteId).subscribe({
      next: () => { this.toast.success('Coupon deleted'); this.deleteId = null; this.load(); },
      error: () => this.toast.error('Delete failed'),
    });
  }

  isExpired(expiry: string): boolean {
    return expiry ? new Date(expiry) < new Date() : false;
  }

  usagePercent(c: any): number {
    return c.maxUses > 0 ? Math.round((c.currentUses / c.maxUses) * 100) : 0;
  }
}
