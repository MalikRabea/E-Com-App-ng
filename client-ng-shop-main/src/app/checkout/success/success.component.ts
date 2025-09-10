import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProduct } from '../../shared/Models/Product';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrl: './success.component.scss'
})
export class SuccessComponent implements OnInit {
  products: IProduct[] = [];
  constructor(private route:ActivatedRoute) { }
  ngOnInit(): void {
    this.route.queryParams.subscribe(param=>{
      this.orderId=param['orderId'];
      this.orderId = history.state.orderId || null;
    this.products = history.state.products || [];
    })
  }
  orderId:number=0;
}
