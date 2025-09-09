import { Component, Input, OnInit } from '@angular/core';
import { IProduct } from '../../shared/Models/Product';
import { BasketService } from '../../basket/basket.service';
import { FavoriteService } from '../../favorite/favorite.service';
import { ShopService } from '../shop.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-shop-item',
  templateUrl: './shop-item.component.html',
  styleUrls: ['./shop-item.component.scss'],
})
export class ShopItemComponent implements OnInit {
  constructor(
    private _service: BasketService,
    private favoriteService: FavoriteService,
    private shopService: ShopService,
    private route: ActivatedRoute
  ) {}

  @Input() Product: IProduct;
  MainImage: string;

  ngOnInit(): void {
    this.loadProduct();
  }

  SetBasketValue() {
    this._service.addItemToBasket(this.Product);
  }

  getArrayofRating(rateOfnumber: number): number[] {
    return Array(rateOfnumber)
      .fill(0)
      .map((x, i) => i);
  }

  addToFavorites(productId: number) {
    const username = 'MRX_17'; // لاحقاً خذه من AuthService
    this.favoriteService.addToFavorites(productId, username).subscribe({
      next: () => {
        this.favoriteService.incrementFavoriteCount();
      },
      error: (err) => console.error(err),
    });
  }

  loadProduct() {
    this.shopService
      .getProductDetails(parseInt(this.route.snapshot.paramMap.get('id')))
      .subscribe({
        next: (value: IProduct) => {
          this.Product = value;
          if (this.Product.photos && this.Product.photos.length > 0) {
            this.MainImage = this.Product.photos[0].imageName;
          } else {
            this.MainImage = 'assets/placeholder.png'; // صورة افتراضية
          }
        },
      });
  }

  ReplaceImage(src: string) {
    this.MainImage = src;
  }
}
