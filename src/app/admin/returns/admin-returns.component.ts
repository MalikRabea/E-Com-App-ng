import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-returns',
  templateUrl: './admin-returns.component.html',
  styleUrls: ['./admin-returns.component.scss'],
})
export class AdminReturnsComponent implements OnInit {
  returns: any[] = [];
  loading = true;
  statusFilter = '';
  detailReturn: any = null;
  adminNote = '';
  updating = false;

  readonly statuses = ['Pending', 'Approved', 'Rejected'];

  constructor(private svc: AdminService, private toast: ToastrService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.svc.getReturnRequests(this.statusFilter).subscribe({
      next: (data) => { this.returns = data; this.loading = false; },
      error: () => (this.loading = false),
    });
  }

  openDetail(r: any) {
    this.detailReturn = r;
    this.adminNote = r.adminNote || '';
  }

  closeDetail() { this.detailReturn = null; }

  updateStatus(status: string) {
    if (!this.detailReturn || this.updating) return;
    this.updating = true;
    this.svc.updateReturnStatus(this.detailReturn.id, status, this.adminNote).subscribe({
      next: () => {
        this.detailReturn.status    = status;
        this.detailReturn.adminNote = this.adminNote;
        const idx = this.returns.findIndex(r => r.id === this.detailReturn.id);
        if (idx !== -1) { this.returns[idx].status = status; this.returns[idx].adminNote = this.adminNote; }
        this.toast.success(`Return marked as ${status}`);
        this.updating = false;
      },
      error: () => { this.toast.error('Failed'); this.updating = false; },
    });
  }

  statusClass(s: string) {
    return s === 'Approved' ? 'status-success' : s === 'Rejected' ? 'status-failed' : 'status-pending';
  }
}
