import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class AdminProductsComponent implements OnInit {
  products: any[] = [];
  categories: any[] = [];
  loading = true;
  totalCount = 0;
  page = 1;
  pageSize = 12;
  imgUrl = environment.imageUrl;

  modalOpen = false;
  deleteConfirmId: number | null = null;
  editMode = false;

  form = { id: 0, name: '', description: '', newPrice: 0, oldPrice: 0, categoryId: 0, stockQuantity: 0, salePrice: null as number | null, saleEndDate: '' };
  selectedFiles: File[] = [];

  constructor(private adminService: AdminService, private toast: ToastrService) {}

  ngOnInit() {
    this.load();
    this.adminService.getCategories().subscribe({ next: c => (this.categories = c) });
  }

  load() {
    this.loading = true;
    this.adminService.getProducts(this.page, this.pageSize).subscribe({
      next: (res) => {
        this.products = res.data;
        this.totalCount = res.totalCount;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  openAdd() {
    this.editMode = false;
    this.form = { id: 0, name: '', description: '', newPrice: 0, oldPrice: 0, categoryId: 0, stockQuantity: 0, salePrice: null, saleEndDate: '' };
    this.selectedFiles = [];
    this.modalOpen = true;
  }

  openEdit(p: any) {
    this.editMode = true;
    this.form = {
      id: p.id, name: p.name, description: p.description,
      newPrice: p.newPrice, oldPrice: p.oldPrice, categoryId: p.categoryId ?? 0,
      stockQuantity: p.stockQuantity ?? 0,
      salePrice: p.salePrice ?? null,
      saleEndDate: p.saleEndDate ? p.saleEndDate.slice(0, 16) : ''
    };
    this.selectedFiles = [];
    this.modalOpen = true;
  }

  closeModal() { this.modalOpen = false; }

  onFilesChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) this.selectedFiles = Array.from(input.files);
  }

  save() {
    const fd = new FormData();
    fd.append('Name', this.form.name);
    fd.append('Description', this.form.description);
    fd.append('NewPrice', String(this.form.newPrice));
    fd.append('OldPrice', String(this.form.oldPrice));
    fd.append('CategoryId', String(this.form.categoryId));
    fd.append('StockQuantity', String(this.form.stockQuantity));
    if (this.form.salePrice != null) fd.append('SalePrice', String(this.form.salePrice));
    if (this.form.saleEndDate) fd.append('SaleEndDate', new Date(this.form.saleEndDate).toISOString());
    this.selectedFiles.forEach(f => fd.append('Photo', f));

    const req = this.editMode
      ? (fd.append('Id', String(this.form.id)), this.adminService.updateProduct(fd))
      : this.adminService.addProduct(fd);

    req.subscribe({
      next: () => {
        this.toast.success(this.editMode ? 'Product updated!' : 'Product added!');
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
    this.adminService.deleteProduct(this.deleteConfirmId).subscribe({
      next: () => {
        this.toast.success('Product deleted');
        this.deleteConfirmId = null;
        this.load();
      },
      error: () => this.toast.error('Delete failed'),
    });
  }

  onPageChange(p: number) { this.page = p; this.load(); }
  get totalPages() { return Math.ceil(this.totalCount / this.pageSize); }
  get pages() { return Array.from({ length: this.totalPages }, (_, i) => i + 1); }
}
