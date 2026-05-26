import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ShopService } from '../shop/shop.service';
import { BasketService } from '../basket/basket.service';
import { IProduct } from '../shared/Models/Product';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-best-sellers',
  templateUrl: './best-sellers.component.html',
  styleUrls: ['./best-sellers.component.scss'],
})
export class BestSellersComponent implements OnInit, OnDestroy {
  bestSellers: IProduct[] = [];
  MainImages: { [key: number]: string } = {};
  loading = false;
  currentSlide = 0;
  slideWidth = 236;
  visibleSlides = 5;
  imgUrl = environment.imageUrl;

  private resizeHandler = () => this.updateSlideWidth();

  constructor(
    private shopService: ShopService,
    private basketService: BasketService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadBestSellers();
    window.addEventListener('resize', this.resizeHandler);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeHandler);
  }

  loadBestSellers() {
    this.loading = true;
    this.shopService.getBestSellers().subscribe({
      next: (res: IProduct[]) => {
        this.bestSellers = res;
        res.forEach((prod) => {
          this.MainImages[prod.id] =
            prod.photos?.length > 0
              ? prod.photos[0].imageName
              : 'Images/default-product.png';
        });
        this.loading = false;
        setTimeout(() => this.updateSlideWidth(), 0);
      },
      error: () => (this.loading = false),
    });
  }

  addToBasket(product: IProduct) {
    this.basketService.addItemToBasket(product, 1);
    this.toast.success('Added to cart!', 'Done');
  }

  getArrayofRating(rate: number | undefined | null): number[] {
    const n = Math.min(Math.max(Math.floor(rate || 0), 0), 5);
    return Array(n).fill(0);
  }

  getEmptyStars(rate: number | undefined | null): number[] {
    const n = Math.min(Math.max(Math.floor(rate || 0), 0), 5);
    return Array(5 - n).fill(0);
  }

  getDots(): number[] {
    const total = this.bestSellers.length - this.visibleSlides + 1;
    return Array(Math.max(total, 0)).fill(0).map((_, i) => i);
  }

  updateSlideWidth() {
    const viewport = document.querySelector('.bs-viewport');
    const w = viewport?.clientWidth || 0;
    if (w < 576)       { this.visibleSlides = 1; }
    else if (w < 768)  { this.visibleSlides = 2; }
    else if (w < 992)  { this.visibleSlides = 3; }
    else if (w < 1200) { this.visibleSlides = 4; }
    else               { this.visibleSlides = 5; }

    this.slideWidth = (w + 16) / this.visibleSlides;
    this.currentSlide = Math.min(this.currentSlide, Math.max(0, this.bestSellers.length - this.visibleSlides));
  }

  nextSlide() {
    if (this.currentSlide < this.bestSellers.length - this.visibleSlides) this.currentSlide++;
  }

  prevSlide() {
    if (this.currentSlide > 0) this.currentSlide--;
  }
}
