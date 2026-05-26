import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss'],
})
export class AdminUsersComponent implements OnInit {
  users: any[] = [];
  filtered: any[] = [];
  loading = true;
  search = '';
  deleteConfirmId: string | null = null;

  constructor(private adminService: AdminService, private toast: ToastrService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.adminService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filtered = data;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  onSearch() {
    const q = this.search.toLowerCase();
    this.filtered = this.users.filter(
      u => u.email?.toLowerCase().includes(q) || u.displayName?.toLowerCase().includes(q)
    );
  }

  confirmDelete(id: string) { this.deleteConfirmId = id; }
  cancelDelete() { this.deleteConfirmId = null; }

  doDelete() {
    if (!this.deleteConfirmId) return;
    this.adminService.deleteUser(this.deleteConfirmId).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== this.deleteConfirmId);
        this.filtered = this.filtered.filter(u => u.id !== this.deleteConfirmId);
        this.deleteConfirmId = null;
        this.toast.success('User deleted');
      },
      error: () => this.toast.error('Failed to delete user'),
    });
  }

  roleClass(role: string) {
    return role === 'Admin' ? 'role-admin' : 'role-user';
  }
}
