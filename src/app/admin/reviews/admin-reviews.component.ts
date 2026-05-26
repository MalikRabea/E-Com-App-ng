import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-reviews',
  templateUrl: './admin-reviews.component.html',
  styleUrls: ['./admin-reviews.component.scss'],
})
export class AdminReviewsComponent implements OnInit {
  reviews: any[] = [];
  loading = true;
  deleteConfirmId: number | null = null;
  searchTerm = '';

  constructor(private adminService: AdminService, private toast: ToastrService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.adminService.getAllReviews().subscribe({
      next: (data) => { this.reviews = data; this.loading = false; },
      error: () => { this.loading = false; this.toast.error('Failed to load reviews'); }
    });
  }

  get filtered() {
    if (!this.searchTerm.trim()) return this.reviews;
    const t = this.searchTerm.toLowerCase();
    return this.reviews.filter(r =>
      r.productName?.toLowerCase().includes(t) ||
      r.userName?.toLowerCase().includes(t) ||
      r.content?.toLowerCase().includes(t)
    );
  }

  confirmDelete(id: number) { this.deleteConfirmId = id; }
  cancelDelete() { this.deleteConfirmId = null; }

  doDelete() {
    if (!this.deleteConfirmId) return;
    this.adminService.deleteReview(this.deleteConfirmId).subscribe({
      next: () => {
        this.reviews = this.reviews.filter(r => r.id !== this.deleteConfirmId);
        this.toast.success('Review deleted');
        this.deleteConfirmId = null;
      },
      error: () => this.toast.error('Delete failed')
    });
  }

  getStars(n: number): number[] { return Array.from({ length: Math.max(0, n) }); }
}
