import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckoutRoutingModule } from './checkout-routing.module';
import { CheckoutComponent } from './checkout/checkout.component';
import { SharedModule } from '../shared/shared.module';
import { StepperComponent } from './stepper/stepper.component';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import {MatButtonModule} from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddressComponent } from './address/address.component';
import { DeliveryComponent } from './delivery/delivery.component';
import {MatRadioModule} from '@angular/material/radio';
import { PaymentComponent } from './payment/payment.component';
import { SuccessComponent } from './success/success.component';
import { CoreService } from '../core/core.service';
import { RatingComponent } from '../rating/rating.component';
import { RatingModule } from '../rating/rating.module';

@NgModule({
  declarations: [
    CheckoutComponent,
    StepperComponent,
    AddressComponent,
    DeliveryComponent,
    PaymentComponent,
    SuccessComponent,
 
  ],
  imports: [
    CommonModule,
    CheckoutRoutingModule,
    SharedModule,
    MatButtonModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
    RatingModule
    
    
    
  ],
  exports:[
    StepperComponent,
    AddressComponent,
    DeliveryComponent,
    PaymentComponent,
    
  ]   
})
export class CheckoutModule { }
