import { Component, Input, OnInit } from '@angular/core';
import { IProduct } from '../../shared/Models/Product';
import { BasketService } from '../../basket/basket.service';
import { FavoriteService } from '../../favorite/favorite.service';
import { Product } from '../../shared/Models/Favorites';
import { ShopService } from '../shop.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-shop-item',
  templateUrl: './shop-item.component.html',
  styleUrl: './shop-item.component.scss',
})
export class ShopItemComponent implements OnInit {
  constructor(private _service: BasketService ,private favoriteService: FavoriteService,private shopService: ShopService,private route: ActivatedRoute,) {}
  @Input() Product: IProduct;
  ngOnInit(): void {
    this.loadProduct();
  }
  SetBasketValue() {
    this._service.addItemToBasket(this.Product);
  }
  getArrayofRating(rateOfnumber:number):number[]{
    return Array(rateOfnumber).fill(0).map((x,i)=>i);
  }
  
addToFavorites(productId: number) {
  const username = 'MRX_17'; // أو خذه من AuthService
  this.favoriteService.addToFavorites(productId, username).subscribe({
    next: () => {
      this.favoriteService.incrementFavoriteCount();
    },
    error: err => console.error(err)
  });
}
  MainImage: string;
  loadProduct() {
    this.shopService
      .getProductDetails(parseInt(this.route.snapshot.paramMap.get('id')))
      .subscribe({
        next: (value: IProduct) => {
          this.Product = value;
          this.MainImage = this.Product.photos[0].imageName;
          console.log(this.Product);
        },
      });
  }
  ReplaceImage(src: string) {
    this.MainImage = src;
  }

}
