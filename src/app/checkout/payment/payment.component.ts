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
import { NotificationService } from '../../core/Services/notification.service';
import { IBasket } from '../../shared/Models/Basket';
import { ICreateOrder } from '../../shared/Models/Order';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
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
  loader: boolean = false;
  private themeObserver: MutationObserver;
  constructor(
    private _service: CheckoutService,
    private toast: ToastrService,
    private basketService: BasketService,
    private router: Router,
    private notifService: NotificationService
  ) {}
  onChange({ error }) {
    if (error) {
      this.cardErrors = error.message;
    } else {
      this.cardErrors = null;
    }
  }

  private buildStyle() {
    const isDark = document.documentElement.classList.contains('dark');
    return {
      base: {
        color:           isDark ? '#f1f5f9' : '#1e293b',
        backgroundColor: 'transparent',
        fontFamily:      "'Inter', -apple-system, sans-serif",
        fontSize:        '15px',
        lineHeight:      '1.5',
        '::placeholder': { color: isDark ? '#94a3b8' : '#64748b' },
      },
      invalid: { color: '#ef4444', iconColor: '#ef4444' },
    };
  }

  ngAfterViewInit(): void {
    this.stripe = Stripe(
      'pk_test_51RxEIVDvC6EKzEmV1feScZWUPexKRzuZiwaqWiA4i79Y9SuSamynaWlbEHGUGjkuJf5imhyjbmGMrOlXEa93Hy9000jKAOE6ov'
    );

    const elements = this.stripe.elements();
    const style    = this.buildStyle();

    this.cardNumber = elements.create('cardNumber', { style });
    this.cardNumber.mount(this.cardNumberElement.nativeElement);
    this.cardNumber.addEventListener('change', this.cardHandler);

    this.cardExpiry = elements.create('cardExpiry', { style });
    this.cardExpiry.mount(this.cardExpiryElement.nativeElement);
    this.cardExpiry.addEventListener('change', this.cardHandler);

    this.cardCvc = elements.create('cardCvc', { style });
    this.cardCvc.mount(this.cardCvcElement.nativeElement);
    this.cardCvc.addEventListener('change', this.cardHandler);

    this.themeObserver = new MutationObserver(() => {
      const updated = this.buildStyle();
      this.cardNumber?.update({ style: updated });
      this.cardExpiry?.update({ style: updated });
      this.cardCvc?.update({ style: updated });
    });
    this.themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
  }

  ngOnDestroy(): void {
    this.themeObserver?.disconnect();
    this.cardNumber?.destroy();
    this.cardExpiry?.destroy();
    this.cardCvc?.destroy();
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
      this.notifService.add({
        type:    'order',
        icon:    'check_circle',
        title:   `Order #${this.orderId} Confirmed`,
        message: 'Your payment was successful. Your order is being processed.',
        link:    `/orders?id=${this.orderId}`,
      });
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
    const value = await firstValueFrom(this._service.CreateOrder(order));
    this.orderId = value.id;
  }
  getOrderCreate(basket: IBasket): ICreateOrder {
    return {
      basketId: basket.id.toString(),
      deliveryMethodId: this.delivery.value.delivery,
      shipAddress: this.Address.value,
    };
  }
}
