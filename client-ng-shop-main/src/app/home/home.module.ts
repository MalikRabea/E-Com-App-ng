import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { NgParticlesModule } from 'ng-particles';
import { Router } from 'express';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DeliveryInfoComponent } from './delivery-info/delivery-info.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsConditionComponent } from './terms-condition/terms-condition.component'; // ← أضف هذا




@NgModule({
  declarations: [
    HomeComponent,
    DeliveryInfoComponent,
    PrivacyPolicyComponent,
    TermsConditionComponent
  ],
  imports: [
    CommonModule,
    NgParticlesModule,
    RouterModule,
    FormsModule  
  ],
  exports:[
    HomeComponent
  ]
})
export class HomeModule { }