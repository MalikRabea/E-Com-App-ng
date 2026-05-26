import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CheckoutService } from '../checkout.service';
import { ToastrService } from 'ngx-toastr';
import { BasketService } from '../../basket/basket.service';
import { IBasket } from '../../shared/Models/Basket';
import { ICreateOrder } from '../../shared/Models/Order';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
declare var Stripe: any;
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss',
})
export class PaymentComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() delivery: FormGroup;
  @Input() Address: FormGroup;
  @Input() paymentform: FormGroup;
  @ViewChild('cardNumber', { static: true }) cardNumberElement: ElementRef;
  @ViewChild('cardExpiry', { static: true }) cardExpiryElement: ElementRef;
  @ViewChild('cardCvc', { static: true }) cardCvcElement: ElementRef;
  stripe: any;
  cardNumber: any;
  cardExpiry: any;
  cardCvc: any;
  cardErrors: any;
  orderId: number;
  cardHandler = this.onChange.bind(this);
  loader:boolean=false;
  constructor(
    private _service: CheckoutService,
    private toast: ToastrService,
    private basketService: BasketService,
    private router: Router
  ) {}
  onChange({ error }) {
    if (error) {
      this.cardErrors = error.message;
    } else {
      this.cardErrors = null;
    }
  }
  ngAfterViewInit(): void {
    this.stripe = Stripe(
      'pk_test_51RxEIVDvC6EKzEmV1feScZWUPexKRzuZiwaqWiA4i79Y9SuSamynaWlbEHGUGjkuJf5imhyjbmGMrOlXEa93Hy9000jKAOE6ov'
    );
    const element = this.stripe.elements();

    this.cardNumber = element.create('cardNumber');
    this.cardNumber.mount(this.cardNumberElement.nativeElement);
    this.cardNumber.addEventListener('change', this.cardHandler);

    this.cardExpiry = element.create('cardExpiry');
    this.cardExpiry.mount(this.cardExpiryElement.nativeElement);
    this.cardExpiry.addEventListener('change', this.cardHandler);

    this.cardCvc = element.create('cardCvc');
    this.cardCvc.mount(this.cardCvcElement.nativeElement);
    this.cardCvc.addEventListener('change', this.cardHandler);
  }
  ngOnDestroy(): void {
    this.cardCvc.destroy();
    this.cardNumber.destroy();
    this.cardExpiry.destroy();
  }
  ngOnInit(): void {}

  async SubmetOrder() {
    this.loader=true;
    const basket = this.basketService.GetCurrentValue();
    const order = this.getOrderCreate(basket);

    await this.CreateOrder(order);

    const PaymentDetials = await this.confirmPaymentWithStripe(basket);
    if (PaymentDetials.paymentIntent) {
      this.loader=false
      this.toast.success('Order Created Successfuly', 'SUCCESS');
      this.router.navigate(['/checkout/success'], {
        queryParams: { orderId: this.orderId },
      });
      this.basketService.deleteBasket();
    } else {
      this.loader=false
      this.toast.error(PaymentDetials.error.message, 'ERROR');
    }
  }
  async confirmPaymentWithStripe(basket: IBasket) {
    return this.stripe.confirmCardPayment(basket.clientSecret, {
      payment_method: {
        card: this.cardNumber,
        billing_details: {
          name: this.paymentform.get('nameOnCard').value,
        },
      },
    });
  }
  async CreateOrder(order: ICreateOrder) {
    this._service.CreateOrder(order).subscribe({
      next: (value) => {
        this.orderId = value.id;
      },
      error: (err) => {
        console.log(err);
        this.toast.error('something went wrong');
      },
    });
  }
  getOrderCreate(basket: IBasket): ICreateOrder {
    return {
      basketId: basket.id.toString(),
      deliveryMethodId: this.delivery.value.delivery,
      shipAddress: this.Address.value,
    };
  }
}
