import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { IProduct } from '../../shared/Models/Product';
import { BasketService } from '../../basket/basket.service';
import { FavoriteService } from '../../favorite/favorite.service';

@Component({
  selector: 'app-shop-item',
  templateUrl: './shop-item.component.html',
  styleUrls: ['./shop-item.component.scss'],
})
export class ShopItemComponent implements OnInit, OnChanges {
  @Input() Product!: IProduct;
  @Output() quickView = new EventEmitter<IProduct>();

  mainImage = '';

  constructor(
    private basketService: BasketService,
    private favoriteService: FavoriteService,
  ) {}

  ngOnInit(): void { this.setDefaultImage(); }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['Product']?.currentValue) this.setDefaultImage();
  }

  private setDefaultImage() {
    this.mainImage = this.Product?.photos?.length
      ? 'https://e-com-app-xfqq.onrender.com/' + this.Product.photos[0].imageName
      : 'assets/no-image.png';
  }

  changeMainImage(img: string) {
    this.mainImage = 'https://e-com-app-xfqq.onrender.com/' + img;
  }

  SetBasketValue() { this.basketService.addItemToBasket(this.Product); }

  addToFavorites(productId: number) {
    this.favoriteService.addToFavorites(productId).subscribe({
      next: () => this.favoriteService.incrementFavoriteCount(),
      error: (err) => console.error(err),
    });
  }

  emitQuickView() { this.quickView.emit(this.Product); }

  getDiscount(): number {
    if (!this.Product.oldPrice || this.Product.oldPrice <= this.Product.newPrice) return 0;
    return Math.round((this.Product.oldPrice - this.Product.newPrice) / this.Product.oldPrice * 100);
  }

  getArrayofRating(rate: number | undefined | null): number[] {
    const n = Math.max(0, Math.floor(rate || 0));
    return Array.from({ length: n });
  }

  getEmptyStars(rate: number | undefined | null): number[] {
    const n = Math.max(0, 5 - Math.floor(rate || 0));
    return Array.from({ length: n });
  }
}
