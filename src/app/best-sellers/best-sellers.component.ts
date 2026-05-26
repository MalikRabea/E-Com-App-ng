import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ShopService } from '../shop/shop.service';
import { BasketService } from '../basket/basket.service';
import { IProduct } from '../shared/Models/Product';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-best-sellers',
  templateUrl: './best-sellers.component.html',
  styleUrls: ['./best-sellers.component.scss'],
})
export class BestSellersComponent implements OnInit {
  bestSellers: IProduct[] = [];
  loading = false;
  imgUrl = environment.imageUrl;
  skeletons = Array(8);

  constructor(
    private shopService: ShopService,
    private basketService: BasketService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadBestSellers();
  }

  loadBestSellers() {
    this.loading = true;
    this.shopService.getBestSellers().subscribe({
      next: (res: IProduct[]) => {
        this.bestSellers = res;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  addToBasket(product: IProduct) {
    this.basketService.addItemToBasket(product, 1);
    this.toast.success('Added to cart!', product.name);
  }

  getStars(rate: number | undefined | null): number[] {
    return Array(Math.min(Math.max(Math.floor(rate || 0), 0), 5)).fill(0);
  }

  getEmptyStars(rate: number | undefined | null): number[] {
    return Array(5 - Math.min(Math.max(Math.floor(rate || 0), 0), 5)).fill(0);
  }
}
