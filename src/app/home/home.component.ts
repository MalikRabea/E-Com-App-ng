import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { ShopService } from '../shop/shop.service';
import { BasketService } from '../basket/basket.service';
import { ToastrService } from 'ngx-toastr';
import { IProduct } from '../shared/Models/Product';
import { ProductParam } from '../shared/Models/ProductParam';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  email = '';
  featuredProducts: IProduct[] = [];
  bestSellers: IProduct[] = [];
  flashSaleProducts: IProduct[] = [];
  featuredLoading = true;
  imgUrl = environment.imageUrl;
  skeletons = Array(8);

  // Animated counters
  statProducts = 0;
  statCustomers = 0;
  statRating = 0;
  private countersStarted = false;

  // Flash sale countdown
  flashEnd = this.nextMidnight();
  countdown = { h: '00', m: '00', s: '00' };
  private timer: any;

  // Scroll reveal
  private observer?: IntersectionObserver;

  categories = [
    { id: 1, name: 'Laptops',       icon: 'laptop',       color: 'rgba(37,99,235,.12)',   count: 48 },
    { id: 2, name: 'Smartphones',   icon: 'smartphone',   color: 'rgba(245,158,11,.12)',  count: 94 },
    { id: 3, name: 'Headphones',    icon: 'headphones',   color: 'rgba(16,185,129,.12)',  count: 32 },
    { id: 4, name: 'Cameras',       icon: 'camera_alt',   color: 'rgba(239,68,68,.12)',   count: 21 },
    { id: 5, name: 'Tablets',       icon: 'tablet',       color: 'rgba(139,92,246,.12)',  count: 17 },
    { id: 6, name: 'Smart Watches', icon: 'watch',        color: 'rgba(236,72,153,.12)',  count: 29 },
  ];

  brands = ['Apple', 'Samsung', 'Sony', 'Dell', 'HP', 'Lenovo', 'Bose', 'Canon', 'Asus', 'LG'];

  testimonials = [
    { name: 'Sara A.',   role: 'Verified Buyer', text: 'Fast delivery and the product quality exceeded my expectations. Will definitely shop again!', avatar: 'S', stars: 5 },
    { name: 'Omar K.',   role: 'Verified Buyer', text: 'Best electronics store in Jordan. Great prices and the support team is super helpful.', avatar: 'O', stars: 5 },
    { name: 'Lina M.',   role: 'Verified Buyer', text: 'Loved the easy returns policy. Ordered a laptop and it arrived next day. Highly recommend!', avatar: 'L', stars: 5 },
    { name: 'Khaled T.', role: 'Verified Buyer', text: 'Authentic products and fair warranty. The loyalty points are a nice bonus too.', avatar: 'K', stars: 4 },
  ];

  constructor(
    private shopService: ShopService,
    private basketService: BasketService,
    private toast: ToastrService,
    private host: ElementRef
  ) {}

  ngOnInit() {
    const params = new ProductParam();
    params.pageSize = 8;
    params.pageNumber = 1;
    this.shopService.getProduct(params).subscribe({
      next: (res) => {
        this.featuredProducts = res.data;
        this.flashSaleProducts = res.data.filter(p => p.oldPrice > p.newPrice).slice(0, 4);
        if (this.flashSaleProducts.length === 0) this.flashSaleProducts = res.data.slice(0, 4);
        this.featuredLoading = false;
      },
      error: () => { this.featuredLoading = false; }
    });

    this.shopService.getBestSellers().subscribe({
      next: (res) => { this.bestSellers = res; },
      error: () => {}
    });

    this.timer = setInterval(() => this.tickCountdown(), 1000);
    this.tickCountdown();
  }

  ngAfterViewInit() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          if (entry.target.classList.contains('hero-stats') && !this.countersStarted) {
            this.countersStarted = true;
            this.animateCounters();
          }
          this.observer?.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    setTimeout(() => {
      this.host.nativeElement.querySelectorAll('.reveal').forEach((el: Element) => this.observer!.observe(el));
    }, 100);
  }

  ngOnDestroy() {
    clearInterval(this.timer);
    this.observer?.disconnect();
  }

  // ── Animated counters ──
  private animateCounters() {
    this.animate(0, 10000, 1500, v => this.statProducts = v);
    this.animate(0, 50000, 1500, v => this.statCustomers = v);
    this.animate(0, 49, 1500, v => this.statRating = v / 10);
  }
  private animate(from: number, to: number, duration: number, cb: (v: number) => void) {
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      cb(Math.floor(from + (to - from) * eased));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // ── Flash sale countdown ──
  private nextMidnight(): number {
    const d = new Date();
    d.setHours(24, 0, 0, 0);
    return d.getTime();
  }
  private tickCountdown() {
    let diff = Math.max(0, this.flashEnd - Date.now());
    if (diff === 0) { this.flashEnd = this.nextMidnight(); diff = this.flashEnd - Date.now(); }
    const h = Math.floor(diff / 3.6e6);
    const m = Math.floor((diff % 3.6e6) / 6e4);
    const s = Math.floor((diff % 6e4) / 1000);
    this.countdown = { h: this.pad(h), m: this.pad(m), s: this.pad(s) };
  }
  private pad(n: number) { return n.toString().padStart(2, '0'); }

  // ── Best sellers carousel ──
  scrollCarousel(dir: number) {
    const el = this.host.nativeElement.querySelector('.bs-carousel-track');
    if (el) el.scrollBy({ left: dir * 320, behavior: 'smooth' });
  }

  addToBasket(product: IProduct, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.basketService.addItemToBasket(product, 1);
    this.toast.success('Added to cart!', product.name);
  }

  getDiscount(product: IProduct): number {
    if (!product.oldPrice || product.oldPrice <= product.newPrice) return 0;
    return Math.round(((product.oldPrice - product.newPrice) / product.oldPrice) * 100);
  }

  getStars(n: number): number[] { return Array(Math.min(Math.max(n, 0), 5)).fill(0); }
  getEmptyStars(n: number): number[] { return Array(5 - Math.min(Math.max(n, 0), 5)).fill(0); }

  subscribeNewsletter() {
    if (!this.email.trim()) return;
    this.toast.success('Subscribed! Check your inbox for exclusive deals.', 'Welcome');
    this.email = '';
  }
}
