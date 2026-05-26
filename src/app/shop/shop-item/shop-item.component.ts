import { Component, Input, Output, EventEmitter, OnInit, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { IProduct } from '../../shared/Models/Product';
import { BasketService } from '../../basket/basket.service';
import { FavoriteService } from '../../favorite/favorite.service';
import { CompareService } from '../compare.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-shop-item',
  templateUrl: './shop-item.component.html',
  styleUrls: ['./shop-item.component.scss'],
})
export class ShopItemComponent implements OnInit, OnChanges, OnDestroy {
  @Input() Product!: IProduct;
  @Output() quickView = new EventEmitter<IProduct>();

  mainImage = '';
  countdown = '';
  private countdownInterval: any;

  constructor(
    private basketService: BasketService,
    private favoriteService: FavoriteService,
    public compareService: CompareService,
    private toast: ToastrService,
  ) {}

  ngOnInit(): void {
    this.setDefaultImage();
    this.startCountdown();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['Product']?.currentValue) {
      this.setDefaultImage();
      this.startCountdown();
    }
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) clearInterval(this.countdownInterval);
  }

  private startCountdown() {
    if (this.countdownInterval) clearInterval(this.countdownInterval);
    if (!this.Product?.saleEndDate) return;
    const tick = () => {
      const end = new Date(this.Product.saleEndDate!).getTime();
      const now = Date.now();
      const diff = end - now;
      if (diff <= 0) { this.countdown = 'Ended'; clearInterval(this.countdownInterval); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      this.countdown = `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
    };
    tick();
    this.countdownInterval = setInterval(tick, 1000);
  }

  isOnSale(): boolean {
    if (!this.Product?.salePrice || !this.Product?.saleEndDate) return false;
    return new Date(this.Product.saleEndDate).getTime() > Date.now();
  }

  displayPrice(): number {
    return this.isOnSale() ? this.Product.salePrice! : this.Product.newPrice;
  }

  private setDefaultImage() {
    this.mainImage = this.Product?.photos?.length
      ? this.Product.photos[0].imageName
      : 'assets/no-image.png';
  }

  changeMainImage(img: string) {
    this.mainImage = img;
  }

  SetBasketValue() { this.basketService.addItemToBasket(this.Product); }

  addToFavorites(productId: number) {
    this.favoriteService.addToFavorites(productId).subscribe({
      next: () => this.favoriteService.incrementFavoriteCount(),
      error: (err) => console.error(err),
    });
  }

  emitQuickView() { this.quickView.emit(this.Product); }

  toggleCompare() {
    if (this.compareService.isAdded(this.Product.id)) {
      this.compareService.remove(this.Product.id);
    } else {
      const added = this.compareService.add(this.Product);
      if (!added) this.toast.warning('Compare list is full (max 3)', 'Compare');
    }
  }

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
