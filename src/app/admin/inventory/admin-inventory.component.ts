import { Component, OnInit } from '@angular/core';
import { SupportService } from '../../core/Services/support.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-inventory',
  templateUrl: './admin-inventory.component.html',
  styleUrls: ['./admin-inventory.component.scss'],
})
export class AdminInventoryComponent implements OnInit {
  movements: any[] = [];
  alerts: any[] = [];
  loading = true;

  restockProduct: any = null;
  restockAmount = 10;
  restocking = false;

  constructor(private support: SupportService, private toast: ToastrService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.support.getReorderAlerts().subscribe({ next: (a) => this.alerts = a });
    this.support.getInventoryMovements().subscribe({
      next: (m) => { this.movements = m; this.loading = false; },
      error: () => this.loading = false
    });
  }

  openRestock(product: any) { this.restockProduct = product; this.restockAmount = 10; }
  closeRestock() { this.restockProduct = null; }

  confirmRestock() {
    if (!this.restockProduct || this.restockAmount < 1) return;
    this.restocking = true;
    this.support.restock(this.restockProduct.id, this.restockAmount, 'Manual restock').subscribe({
      next: () => {
        this.toast.success(`Restocked ${this.restockProduct.name}`, 'Done');
        this.restocking = false;
        this.closeRestock();
        this.load();
      },
      error: () => { this.restocking = false; this.toast.error('Failed', 'Error'); }
    });
  }
}
