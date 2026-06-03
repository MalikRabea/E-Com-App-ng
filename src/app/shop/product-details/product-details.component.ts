import { Component, OnInit, HostListener } from '@angular/core';
import { ShopService } from '../shop.service';
import { IProduct } from '../../shared/Models/Product';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BasketService } from '../../basket/basket.service';
import { IReview } from '../../shared/Models/review';
import { FavoriteService } from '../../favorite/favorite.service';
import { CommerceService } from '../../core/Services/commerce.service';
import { CommercialService } from '../../core/Services/commercial.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit {
  constructor(
    private shopService: ShopService,
    private route: ActivatedRoute,
    private toast: ToastrService,
    private basketService: BasketService,
    private favoriteService: FavoriteService,
    private commerce: CommerceService,
    private commercial: CommercialService
  ) {}

  bundles: any[] = [];
  priceTiers: any[] = [];
  basePrice = 0;

  reviews: IReview[] = [];
  qunatity: number = 1;
  product: IProduct = {
    id: 0, name: '', description: '', oldPrice: 0,
    newPrice: 0, categoryName: '', soldCount: 0, stockQuantity: 0, photos: []
  };
  loading: boolean = false;
  stockRefreshing = false;
  MainImage: string = 'assets/default.jpg';
  recentlyViewed: IProduct[] = [];
  relatedProducts: IProduct[] = [];
  frequentlyBought: IProduct[] = [];
  showSticky = false;
  shareOpen = false;
  variants: any[] = [];
  selectedVariants: Record<number, string> = {};

  // Subscribe & Save
  subOpen = false;
  subInterval = 'Monthly';
  subQuantity = 1;
  subscribing = false;

  private readonly RV_KEY = 'recentlyViewed';
  private readonly RV_MAX = 6;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const productId = parseInt(params.get('id') || '0');
      if (productId) this.loadProduct(productId);
    });
  }

  loadProduct(productId: number) {
    this.shopService.getProductDetails(productId).subscribe({
      next: (value: IProduct) => {
        this.product = value;
        this.MainImage = this.product.photos?.length > 0
          ? this.product.photos[0].imageName
          : 'assets/default.jpg';
        this.saveRecentlyViewed(value);
        this.loadRecentlyViewed(value.id);
        this.loadRelatedProducts(productId);
        this.loadVariants(productId);
        this.loadFrequentlyBought(productId);
        this.loadBundles(productId);
        this.loadTiers(productId);
      },
      error: (err) => {
        console.error(err);
        this.toast.error('Error loading product details', 'Error');
      }
    });
  }

  private saveRecentlyViewed(product: IProduct) {
    const stored: IProduct[] = JSON.parse(localStorage.getItem(this.RV_KEY) || '[]');
    const filtered = stored.filter(p => p.id !== product.id);
    filtered.unshift(product);
    localStorage.setItem(this.RV_KEY, JSON.stringify(filtered.slice(0, this.RV_MAX)));
  }

  private loadRecentlyViewed(currentId: number) {
    const stored: IProduct[] = JSON.parse(localStorage.getItem(this.RV_KEY) || '[]');
    this.recentlyViewed = stored.filter(p => p.id !== currentId).slice(0, 4);
  }

  private loadRelatedProducts(productId: number) {
    this.shopService.getRelatedProducts(productId).subscribe({
      next: (products) => { this.relatedProducts = products; },
      error: () => {}
    });
  }

  private loadVariants(productId: number) {
    this.shopService.getProductVariants(productId).subscribe({
      next: (v) => { this.variants = v; },
      error: () => { this.variants = []; }
    });
  }

  selectVariant(variantId: number, value: string) {
    this.selectedVariants = { ...this.selectedVariants, [variantId]: value };
  }

  private loadFrequentlyBought(productId: number) {
    this.commerce.frequentlyBought(productId, 4).subscribe({
      next: (products) => { this.frequentlyBought = products; },
      error: () => { this.frequentlyBought = []; }
    });
  }

  private loadBundles(productId: number) {
    this.commercial.bundlesForProduct(productId).subscribe({
      next: (b) => { this.bundles = b; },
      error: () => { this.bundles = []; }
    });
  }

  private loadTiers(productId: number) {
    this.commercial.getTiers(productId).subscribe({
      next: (res) => { this.basePrice = res.basePrice; this.priceTiers = res.tiers || []; },
      error: () => { this.priceTiers = []; }
    });
  }

  // Effective unit price for current quantity given the tiers
  get effectiveUnitPrice(): number {
    if (this.priceTiers.length === 0) return this.product.newPrice;
    const applicable = this.priceTiers
      .filter(t => t.minQuantity <= this.qunatity)
      .sort((a, b) => b.minQuantity - a.minQuantity)[0];
    return applicable ? applicable.unitPrice : this.product.newPrice;
  }

  get tierSavings(): number {
    return (this.product.newPrice - this.effectiveUnitPrice) * this.qunatity;
  }

  addBundleToCart(bundle: any) {
    bundle.items.forEach((it: any) => {
      this.basketService.addItemToBasket({
        id: it.productId, name: it.name, newPrice: it.price,
        photos: it.image ? [{ imageName: it.image, productId: it.productId }] : [],
      } as any, 1);
    });
    this.toast.success(`"${bundle.name}" added to cart — you saved ${bundle.savings}!`, 'Bundle Added');
  }

  get subDiscountedPrice(): number {
    return this.product.newPrice * 0.9 * this.subQuantity;
  }

  openSubscribe() { this.subOpen = true; }
  closeSubscribe() { this.subOpen = false; }

  confirmSubscribe() {
    this.subscribing = true;
    this.commerce.createSubscription(this.product.id, this.subQuantity, this.subInterval).subscribe({
      next: () => {
        this.subscribing = false;
        this.subOpen = false;
        this.toast.success('Subscription created! Save 10% on every delivery.', 'Subscribed');
      },
      error: () => {
        this.subscribing = false;
        this.toast.error('Please sign in to subscribe', 'Login Required');
      }
    });
  }

  ReplaceImage(src: string) {
    this.MainImage = src;
  }

  incrementBasket() {
    if (this.qunatity < 10) {
      this.qunatity++;
      this.toast.success('Item has been added to the basket', 'SUCCESS');
    } else {
      this.toast.warning("You can't add more than 10 items", 'Enough');
    }
  }

  DecrementBasket() {
    if (this.qunatity > 1) {
      this.qunatity--;
      this.toast.warning('Item has been Decrement', 'SUCCESS');
    } else {
      this.toast.error("You can't Decrement more than 1 item", 'ERROR');
    }
  }

  AddToBasket() {
    this.basketService.addItemToBasket(this.product, this.qunatity);
    this.toast.success('Item has been added to basket', 'SUCCESS');
  }

  CalucateDiscount(oldPrice: number, newPrice: number): number {
    return parseFloat(
      Math.round(((oldPrice - newPrice) / oldPrice) * 100).toFixed(1)
    );
  }

  showReview(id: number) {
    this.loading = true;
    this.shopService.getProductRating(id).subscribe({
      next: (res) => {
        this.loading = false;
        this.reviews = res;
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
      }
    });
  }

  addToFavorites(productId: number) {
    this.favoriteService.addToFavorites(productId).subscribe({
      next: () => this.favoriteService.incrementFavoriteCount(),
      error: (err) => console.error(err),
    });
  }

  getStars(rating: number | undefined): number[] {
    return Array.from({ length: Math.max(0, Math.floor(rating || 0)) });
  }

  @HostListener('window:scroll')
  onScroll() {
    this.showSticky = window.scrollY > 450;
  }

  refreshStock() {
    if (!this.product.id || this.stockRefreshing) return;
    this.stockRefreshing = true;
    this.shopService.getProductDetails(this.product.id).subscribe({
      next: (p) => {
        this.product.stockQuantity = p.stockQuantity;
        this.stockRefreshing = false;
        this.toast.info(`Stock updated: ${p.stockQuantity} available`, 'Stock');
      },
      error: () => { this.stockRefreshing = false; }
    });
  }

  shareProduct(via: 'copy' | 'whatsapp' | 'native') {
    const url  = window.location.href;
    const text = `Check out ${this.product.name} — ${url}`;
    if (via === 'native' && navigator.share) {
      navigator.share({ title: this.product.name, url }).catch(() => {});
    } else if (via === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    } else {
      navigator.clipboard.writeText(url).then(() =>
        this.toast.success('Link copied to clipboard!', 'Copied')
      );
    }
    this.shareOpen = false;
  }
}
