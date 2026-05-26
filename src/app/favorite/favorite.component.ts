import { Component, OnInit } from '@angular/core';
import { FavoriteService } from './favorite.service';
import { BasketService } from '../basket/basket.service';
import { Product } from '../shared/Models/Favorites';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent implements OnInit {
  favorites: Product[] = [];
  imgUrl = environment.imageUrl;

  constructor(
    private favoriteService: FavoriteService,
    private basketService: BasketService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  loading = true;
  private readonly PRICE_KEY = 'wishlist_prices';

  loadFavorites() {
    this.loading = true;
    this.favoriteService.getFavorites().subscribe({
      next: (data: Product[]) => {
        this.favorites = data;
        this.favoriteService.setFavoriteCount(this.favorites.length);
        this.loading = false;
        this.checkPriceDrops(data);
      },
      error: (err) => { console.error(err); this.loading = false; }
    });
  }

  private checkPriceDrops(products: Product[]) {
    const stored: Record<number, number> = JSON.parse(localStorage.getItem(this.PRICE_KEY) || '{}');
    products.forEach(p => {
      if (stored[p.id] && p.newPrice < stored[p.id]) {
        const diff = stored[p.id] - p.newPrice;
        this.toast.info(
          `Price dropped by $${diff.toFixed(2)} on "${p.name}"!`,
          'Price Drop'
        );
      }
    });
    const prices: Record<number, number> = {};
    products.forEach(p => prices[p.id] = p.newPrice);
    localStorage.setItem(this.PRICE_KEY, JSON.stringify(prices));
  }

  getPriceDrop(product: Product): number {
    const stored: Record<number, number> = JSON.parse(localStorage.getItem(this.PRICE_KEY) || '{}');
    const prev = stored[product.id];
    return prev && prev > product.newPrice ? prev - product.newPrice : 0;
  }

  removeFavorite(productId: number) {
    this.favoriteService.removeFromFavorites(productId).subscribe({
      next: () => {
        this.favorites = this.favorites.filter(p => p.id !== productId);
        this.favoriteService.setFavoriteCount(this.favorites.length);
        this.toast.success('Removed from wishlist', 'Done');
      },
      error: (err) => console.error(err)
    });
  }

  addToBasket(product: Product) {
    this.basketService.addItemToBasket(product as any, 1);
    this.toast.success('Added to cart!', 'Done');
  }

  getStars(rate: number): number[] {
    const n = Math.min(Math.max(Math.round(rate || 0), 0), 5);
    return Array(n).fill(0);
  }

  getEmptyStars(rate: number): number[] {
    const n = Math.min(Math.max(Math.round(rate || 0), 0), 5);
    return Array(5 - n).fill(0);
  }

  getDiscount(product: Product): number {
    if (!product.oldPrice || product.oldPrice <= product.newPrice) return 0;
    return Math.round(((product.oldPrice - product.newPrice) / product.oldPrice) * 100);
  }
}
