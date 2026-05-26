import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CoreService } from '../../core/core.service';
import { Router } from '@angular/router';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.scss'
})
export class StepperComponent {
  private _formBuilder = inject(FormBuilder);
  private coreService = inject(CoreService);
  private router = inject(Router);

  @ViewChild('stepper') stepper!: MatStepper;

  userName: string = '';

  constructor() {
    this.coreService.userName$.subscribe(name => {
      this.userName = name;
    });
  }

  Address = this._formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    street: ['', Validators.required],
    city: ['', Validators.required],
    zipCode: ['', Validators.required],
    state: ['', Validators.required],
  });

  DeliveryMethod = this._formBuilder.group({
    delivery: ['', Validators.required],
  });

  PaymentForm = this._formBuilder.group({
    nameOnCard: ['', Validators.required]
  });

  continueOrPay() {
    if (!this.userName) {
      this.router.navigate(['/Account/Login'], { queryParams: { returnUrl: '/checkout' } });
      return;
    }

    // إذا مسجل دخول، استمر بالخطوة التالية
    if (this.stepper.selectedIndex < 2) {
      this.stepper.next();
    } else {
      // آخر خطوة → ابدأ الدفع
      console.log('بدء عملية الدفع');
    }
  }
}
