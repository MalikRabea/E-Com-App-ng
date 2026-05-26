import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CheckoutService } from '../checkout.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrl: './address.component.scss',
})
export class AddressComponent implements OnInit {
  @Input() address: FormGroup;
  canEdit=false;
  constructor(private _service: CheckoutService,private toast: ToastrService) {}
  ngOnInit(): void {
    this._service.getAddress().subscribe({
      next: (value) => {
        this.address.patchValue(value);
      },
    });
  }
  UpdateAddress() {
  if (this.address.valid) {
    this._service.updateAddress(this.address.value).subscribe({
      next: (value) => {
        this.toast.success('Address updated successfully ✅', 'SUCCESS');
        console.log(value);
      },
      error: (err) => {
        this.toast.error('Failed to update address ❌', 'ERROR');
        console.log(err);
      }
    });
  }
}
}
