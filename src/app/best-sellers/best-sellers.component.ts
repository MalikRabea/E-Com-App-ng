import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ShopService } from '../shop/shop.service';
import { BasketService } from '../basket/basket.service';
import { FavoriteService } from '../favorite/favorite.service';
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

  categories: string[] = [];
  activeCategory = 'All';

  maxSold = 1;
  quickViewProduct: IProduct | null = null;

  constructor(
    private shopService: ShopService,
    private basketService: BasketService,
    private favoriteService: FavoriteService,
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
        this.maxSold = Math.max(...res.map(p => p.soldCount), 1);
        this.categories = ['All', ...Array.from(new Set(res.map(p => p.categoryName).filter(Boolean)))];
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  // ── Filtering by category (keeps global rank) ──
  get rankedProducts(): (IProduct & { rank: number })[] {
    const ranked = this.bestSellers.map((p, i) => ({ ...p, rank: i + 1 }));
    if (this.activeCategory === 'All') return ranked;
    return ranked.filter(p => p.categoryName === this.activeCategory);
  }

  get podium(): (IProduct & { rank: number })[] {
    return this.rankedProducts.slice(0, 3);
  }

  get rest(): (IProduct & { rank: number })[] {
    return this.rankedProducts.slice(3);
  }

  setCategory(c: string) { this.activeCategory = c; }

  // ── Sales velocity (relative to top seller) ──
  velocity(product: IProduct): number {
    return Math.max(Math.round((product.soldCount / this.maxSold) * 100), 5);
  }

  isHot(product: IProduct): boolean {
    return product.soldCount >= this.maxSold * 0.7;
  }

  isSellingFast(product: IProduct): boolean {
    return product.stockQuantity > 0 && product.stockQuantity <= 5;
  }

  // ── Social proof helpers ──
  weeklySold(product: IProduct): number {
    // deterministic pseudo "this week" figure derived from soldCount
    return Math.max(Math.round(product.soldCount * 0.18), 3);
  }

  // ── Actions ──
  addToBasket(product: IProduct) {
    this.basketService.addItemToBasket(product, 1);
    this.toast.success('Added to cart!', product.name);
  }

  addToWishlist(product: IProduct, e?: Event) {
    e?.stopPropagation();
    this.favoriteService.addToFavorites(product.id).subscribe({
      next: () => { this.favoriteService.incrementFavoriteCount(); this.toast.success('Added to wishlist', product.name); },
      error: () => this.toast.error('Please sign in to save favorites', 'Login Required')
    });
  }

  openQuickView(product: IProduct, e?: Event) {
    e?.stopPropagation();
    this.quickViewProduct = product;
    document.body.style.overflow = 'hidden';
  }
  closeQuickView() {
    this.quickViewProduct = null;
    document.body.style.overflow = '';
  }

  medalIcon(rank: number): string {
    return rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉';
  }

  getStars(rate: number | undefined | null): number[] {
    return Array(Math.min(Math.max(Math.floor(rate || 0), 0), 5)).fill(0);
  }
  getEmptyStars(rate: number | undefined | null): number[] {
    return Array(5 - Math.min(Math.max(Math.floor(rate || 0), 0), 5)).fill(0);
  }
  getDiscount(product: IProduct): number {
    if (!product.oldPrice || product.oldPrice <= product.newPrice) return 0;
    return Math.round(((product.oldPrice - product.newPrice) / product.oldPrice) * 100);
  }
}
