import { Component, OnInit } from '@angular/core';
import { FavoriteService } from './favorite.service';
import { BasketService } from '../basket/basket.service';
import { Product } from '../shared/Models/Favorites';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';
import { CommerceService } from '../core/Services/commerce.service';

type SortKey = 'newest' | 'priceLow' | 'priceHigh' | 'discount';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent implements OnInit {
  favorites: Product[] = [];
  imgUrl = environment.imageUrl;
  loading = true;

  // Filters & sorting
  sortKey: SortKey = 'newest';
  inStockOnly = false;
  onSaleOnly = false;

  // Subscribe modal
  subProduct: Product | null = null;
  subInterval = 'Monthly';
  subscribing = false;

  private readonly PRICE_KEY = 'wishlist_prices';

  constructor(
    private favoriteService: FavoriteService,
    private basketService: BasketService,
    private toast: ToastrService,
    private commerce: CommerceService
  ) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

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

  // ── Derived list (filter + sort) ──
  get displayFavorites(): Product[] {
    let list = [...this.favorites];
    if (this.inStockOnly) list = list.filter(p => (p.stockQuantity ?? 1) > 0);
    if (this.onSaleOnly)   list = list.filter(p => p.oldPrice > p.newPrice);

    switch (this.sortKey) {
      case 'priceLow':  list.sort((a, b) => a.newPrice - b.newPrice); break;
      case 'priceHigh': list.sort((a, b) => b.newPrice - a.newPrice); break;
      case 'discount':  list.sort((a, b) => this.getDiscount(b) - this.getDiscount(a)); break;
      default: /* newest = keep API order */ break;
    }
    return list;
  }

  get totalValue(): number {
    return this.displayFavorites.reduce((sum, p) => sum + p.newPrice, 0);
  }

  get totalSavings(): number {
    return this.displayFavorites.reduce((sum, p) =>
      sum + (p.oldPrice > p.newPrice ? p.oldPrice - p.newPrice : 0), 0);
  }

  get inStockCount(): number {
    return this.favorites.filter(p => (p.stockQuantity ?? 1) > 0).length;
  }

  setSort(key: SortKey) { this.sortKey = key; }

  // ── Stock helpers ──
  isOutOfStock(p: Product): boolean { return (p.stockQuantity ?? 1) <= 0; }
  isLowStock(p: Product): boolean {
    const s = p.stockQuantity ?? 99;
    return s > 0 && s <= 5;
  }

  // ── Price drop tracking ──
  private checkPriceDrops(products: Product[]) {
    const stored: Record<number, number> = JSON.parse(localStorage.getItem(this.PRICE_KEY) || '{}');
    products.forEach(p => {
      if (stored[p.id] && p.newPrice < stored[p.id]) {
        const diff = stored[p.id] - p.newPrice;
        this.toast.info(`Price dropped by $${diff.toFixed(2)} on "${p.name}"!`, 'Price Drop');
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

  // ── Actions ──
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
    if (this.isOutOfStock(product)) return;
    this.basketService.addItemToBasket(product as any, 1);
    this.toast.success('Added to cart!', 'Done');
  }

  moveToBasket(product: Product) {
    if (this.isOutOfStock(product)) return;
    this.basketService.addItemToBasket(product as any, 1);
    this.favoriteService.removeFromFavorites(product.id).subscribe({
      next: () => {
        this.favorites = this.favorites.filter(p => p.id !== product.id);
        this.favoriteService.setFavoriteCount(this.favorites.length);
        this.toast.success('Moved to cart!', 'Done');
      }
    });
  }

  addAllToCart() {
    const available = this.displayFavorites.filter(p => !this.isOutOfStock(p));
    if (available.length === 0) {
      this.toast.warning('No in-stock items to add', 'Wishlist');
      return;
    }
    available.forEach(p => this.basketService.addItemToBasket(p as any, 1));
    this.toast.success(`${available.length} item(s) added to cart!`, 'Done');
  }

  notifyMe(product: Product) {
    const list: number[] = JSON.parse(localStorage.getItem('stockNotify') || '[]');
    if (!list.includes(product.id)) {
      list.push(product.id);
      localStorage.setItem('stockNotify', JSON.stringify(list));
    }
    this.toast.success(`We'll notify you when "${product.name}" is back!`, 'Subscribed');
  }

  // ── Share ──
  shareWishlist() {
    const names = this.favorites.map(p => p.name).slice(0, 5).join(', ');
    const text  = `Check out my E-Shop wishlist: ${names}${this.favorites.length > 5 ? '...' : ''}`;
    const url   = window.location.origin + '/shop';
    if (navigator.share) {
      navigator.share({ title: 'My E-Shop Wishlist', text, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${text} — ${url}`).then(() =>
        this.toast.success('Wishlist link copied!', 'Copied'));
    }
  }

  // ── Subscribe & Save ──
  openSubscribe(product: Product) {
    this.subProduct = product;
    this.subInterval = 'Monthly';
  }
  closeSubscribe() { this.subProduct = null; }

  confirmSubscribe() {
    if (!this.subProduct) return;
    this.subscribing = true;
    this.commerce.createSubscription(this.subProduct.id, 1, this.subInterval).subscribe({
      next: () => {
        this.subscribing = false;
        this.toast.success('Subscribed! Save 10% on every delivery.', 'Done');
        this.closeSubscribe();
      },
      error: () => {
        this.subscribing = false;
        this.toast.error('Please sign in to subscribe', 'Login Required');
      }
    });
  }

  // ── Stars / discount ──
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
