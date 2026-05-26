import { Component, OnInit } from '@angular/core';
import { IOrder, IOrderItem } from '../../shared/Models/Order';
import { OrdersService } from '../orders.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
})
export class OrderComponent implements OnInit {
  orders: IOrder[] = [];
  modalOpen = false;
  modalImages: string[] = [];
  private imgUrl = environment.imageUrl;

  constructor(private _service: OrdersService) {}

  ngOnInit(): void {
    this._service.getAllOrderForUser().subscribe({
      next: (res) => (this.orders = res),
      error: (err) => console.log(err),
    });
  }

  openModal(orderItems: IOrderItem[]) {
    this.modalImages = orderItems.map(item => this.imgUrl + item.mainImage);
    this.modalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.modalOpen = false;
    this.modalImages = [];
    document.body.style.overflow = '';
  }

  getFirstImage(orderItems: IOrderItem[]): string {
    return orderItems.length > 0
      ? this.imgUrl + orderItems[0].mainImage
      : '/assets/no-image.png';
  }
}
