import { Component, Input, OnInit } from '@angular/core';
import { IProduct } from '../../shared/Models/Product';
import { BasketService } from '../../basket/basket.service';
import { FavoriteService } from '../../favorite/favorite.service';

@Component({
  selector: 'app-shop-item',
  templateUrl: './shop-item.component.html',
  styleUrls: ['./shop-item.component.scss']
})
export class ShopItemComponent implements OnInit {
  @Input() Product: IProduct;
  mainImage: string;

  constructor(
    private _service: BasketService,
    private favoriteService: FavoriteService
  ) {}

  ngOnInit(): void {
    if (this.Product?.photos && this.Product.photos.length > 0) {
      this.mainImage = 'https://e-com-app-xfqq.onrender.com/' + this.Product.photos[0].imageName;
    } else {
      this.mainImage = 'assets/no-image.png';
    }
  }

  changeMainImage(img: string) {
    this.mainImage = 'https://e-com-app-xfqq.onrender.com/' + img;
  }

  SetBasketValue() {
    this._service.addItemToBasket(this.Product);
  }

  getArrayofRating(rateOfnumber: number): number[] {
    return Array(rateOfnumber).fill(0).map((x, i) => i);
  }

  addToFavorites(productId: number) {
    const username = 'MRX_17';
    this.favoriteService.addToFavorites(productId, username).subscribe({
      next: () => {
        this.favoriteService.incrementFavoriteCount();
      },
      error: (err) => console.error(err)
    });
  }
}
