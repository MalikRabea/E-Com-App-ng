import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class AdminCategoriesComponent implements OnInit {
  categories: any[] = [];
  loading = true;
  modalOpen = false;
  editMode = false;
  deleteConfirmId: number | null = null;

  form = { id: 0, name: '', description: '' };

  constructor(private adminService: AdminService, private toast: ToastrService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.adminService.getCategories().subscribe({
      next: (c) => { this.categories = c; this.loading = false; },
      error: () => (this.loading = false),
    });
  }

  openAdd() {
    this.editMode = false;
    this.form = { id: 0, name: '', description: '' };
    this.modalOpen = true;
  }

  openEdit(cat: any) {
    this.editMode = true;
    this.form = { id: cat.id, name: cat.name, description: cat.description };
    this.modalOpen = true;
  }

  closeModal() { this.modalOpen = false; }

  save() {
    const req = this.editMode
      ? this.adminService.updateCategory({ id: this.form.id, name: this.form.name, description: this.form.description })
      : this.adminService.addCategory({ name: this.form.name, description: this.form.description });

    req.subscribe({
      next: () => {
        this.toast.success(this.editMode ? 'Category updated!' : 'Category added!');
        this.closeModal();
        this.load();
      },
      error: () => this.toast.error('Operation failed'),
    });
  }

  confirmDelete(id: number) { this.deleteConfirmId = id; }
  cancelDelete() { this.deleteConfirmId = null; }

  doDelete() {
    if (!this.deleteConfirmId) return;
    this.adminService.deleteCategory(this.deleteConfirmId).subscribe({
      next: () => {
        this.toast.success('Category deleted');
        this.deleteConfirmId = null;
        this.load();
      },
      error: () => this.toast.error('Delete failed'),
    });
  }
}
