import { Router } from '@angular/router';
import { CoreService } from './../../core/core.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {

  constructor(private coreService:CoreService,private router:Router) { }

  ngOnInit(): void {
    // التحقق من تسجيل الدخول
    this.coreService.userName$.subscribe(userName => {
      if (!userName) {
        this.router.navigate(['/Account/Login'], { queryParams: { returnUrl: '/checkout' } });
      }
    });
  }

}
