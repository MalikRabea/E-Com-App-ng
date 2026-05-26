import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

export interface IAddress {
  id: string;
  label: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

@Component({
  selector: 'app-address-book',
  templateUrl: './address-book.component.html',
  styleUrls: ['./address-book.component.scss'],
})
export class AddressBookComponent implements OnInit {
  private readonly KEY = 'addressBook';
  addresses: IAddress[] = [];
  showForm = false;
  editingId: string | null = null;
  deleteConfirmId: string | null = null;

  form: Partial<IAddress> = this.emptyForm();

  constructor(private toast: ToastrService) {}

  ngOnInit() { this.load(); }

  private load() {
    this.addresses = JSON.parse(localStorage.getItem(this.KEY) || '[]');
  }

  private save() {
    localStorage.setItem(this.KEY, JSON.stringify(this.addresses));
  }

  emptyForm(): Partial<IAddress> {
    return { label: '', firstName: '', lastName: '', street: '', city: '', state: '', zip: '', country: '', isDefault: false };
  }

  openAdd() {
    this.editingId = null;
    this.form = this.emptyForm();
    this.showForm = true;
  }

  openEdit(addr: IAddress) {
    this.editingId = addr.id;
    this.form = { ...addr };
    this.showForm = true;
  }

  cancelForm() {
    this.showForm = false;
    this.editingId = null;
    this.form = this.emptyForm();
  }

  submit() {
    if (!this.form.firstName || !this.form.street || !this.form.city) {
      this.toast.error('Please fill in required fields', 'Error');
      return;
    }
    if (this.editingId) {
      const idx = this.addresses.findIndex(a => a.id === this.editingId);
      if (idx !== -1) {
        if (this.form.isDefault) this.addresses.forEach(a => a.isDefault = false);
        this.addresses[idx] = { ...this.addresses[idx], ...this.form } as IAddress;
      }
      this.toast.success('Address updated!', 'Done');
    } else {
      if (this.form.isDefault) this.addresses.forEach(a => a.isDefault = false);
      const newAddr: IAddress = {
        ...this.form as IAddress,
        id: Date.now().toString(),
        isDefault: this.form.isDefault ?? false,
      };
      if (this.addresses.length === 0) newAddr.isDefault = true;
      this.addresses.push(newAddr);
      this.toast.success('Address saved!', 'Done');
    }
    this.save();
    this.cancelForm();
  }

  setDefault(id: string) {
    this.addresses.forEach(a => a.isDefault = a.id === id);
    this.save();
    this.toast.success('Default address updated', 'Done');
  }

  confirmDelete(id: string) { this.deleteConfirmId = id; }
  cancelDelete() { this.deleteConfirmId = null; }

  doDelete() {
    this.addresses = this.addresses.filter(a => a.id !== this.deleteConfirmId);
    if (this.addresses.length > 0 && !this.addresses.some(a => a.isDefault)) {
      this.addresses[0].isDefault = true;
    }
    this.save();
    this.toast.success('Address removed', 'Done');
    this.deleteConfirmId = null;
  }
}
