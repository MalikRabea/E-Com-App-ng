import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IOrder } from '../../shared/Models/Order';
import { OrdersService } from '../../orders/orders.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit {
  orderId: number;
  order: IOrder | null = null;

  constructor(
    private route: ActivatedRoute,
    private ordersService: OrdersService
  ) {}

  ngOnInit(): void {
    this.orderId = Number(this.route.snapshot.queryParamMap.get('orderId'));

    if (this.orderId) {
      this.ordersService.getCurrentOrderForUser(this.orderId).subscribe({
        next: (order) => {
          this.order = order;
        },
        error: (err) => console.error(err)
      });
    }
  }
}
