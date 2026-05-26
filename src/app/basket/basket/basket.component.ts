import { Component, OnInit } from '@angular/core';
import { BasketService, ICoupon } from '../basket.service';
import { IBasket, IBasketItem } from '../../shared/Models/Basket';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.scss'
})
export class BasketComponent implements OnInit {
  constructor(private basketService: BasketService, private toast: ToastrService) {}

  basket: IBasket;
  couponCode = '';
  appliedCoupon: ICoupon | null = null;
  couponLoading = false;
  ngOnInit(): void {
    this.basketService.basket$.subscribe({
      next: (value) => { this.basket = value; },
      error: (err) => { console.log(err); },
    });
    this.basketService.coupon$.subscribe(c => { this.appliedCoupon = c; });
  }
  RemoveBasket(item:IBasketItem){
    this.basketService.removeItemFormBasket(item)
  }
  incrementQuantity(item:IBasketItem){
    this.basketService.incrementBasketItemQuantity(item);
  }
  DecrementQuantity(item:IBasketItem){
    this.basketService.DecrementBasketItemQuantity(item);
  }
  applyCoupon() {
    if (!this.couponCode.trim()) return;
    this.couponLoading = true;
    this.basketService.validateCoupon(this.couponCode.trim()).subscribe({
      next: (coupon) => {
        this.basketService.applyCoupon(coupon);
        this.toast.success(coupon.message, 'Coupon Applied');
        this.couponLoading = false;
      },
      error: (err) => {
        const msg = err?.error?.message || 'Invalid coupon';
        this.toast.error(msg, 'Coupon Error');
        this.couponLoading = false;
      }
    });
  }

  removeCoupon() {
    this.basketService.removeCoupon();
    this.couponCode = '';
    this.toast.info('Coupon removed', 'Cart');
  }
}
