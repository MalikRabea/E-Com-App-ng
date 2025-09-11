import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ShopService } from '../shop/shop.service';
import { BasketService } from '../basket/basket.service';
import { IProduct } from '../shared/Models/Product';

@Component({
  selector: 'app-best-sellers',
  templateUrl: './best-sellers.component.html',
  styleUrls: ['./best-sellers.component.scss'],
})
export class BestSellersComponent implements OnInit {
  bestSellers: IProduct[] = [];
  MainImages: { [key: number]: string } = {}; // لتخزين أول صورة لكل منتج

  loading: boolean = false;
    currentSlide = 0;

 slideWidth = 240; // عرض كل كارد + margin
visibleSlides = 5; // عدد الكروت الظاهرة في نفس الوقت

  constructor(
    private shopService: ShopService,
    private basketService: BasketService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadBestSellers();
      this.updateSlideWidth();
    window.addEventListener('resize', () => this.updateSlideWidth());
  }

    loadBestSellers() {
    this.loading = true;
    this.shopService.getBestSellers().subscribe({
      next: (res: IProduct[]) => {
        this.bestSellers = res;
        // تخزين أول صورة لكل منتج
        this.bestSellers.forEach((prod) => {
          if (prod.photos && prod.photos.length > 0) {
            this.MainImages[prod.id] = prod.photos[0].imageName;
          } else {
            this.MainImages[prod.id] = '/Images/default-product.png'; // صورة افتراضية إذا ما في صور
          }
        });
        this.loading = false;
                  console.log(this.bestSellers);

      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
    });
  }
  

 getArrayofRating(rateOfnumber: number | undefined | null): number[] {
  const safeNumber = Math.max(0, Math.floor(rateOfnumber || 0));
  return Array.from({ length: safeNumber }, (_, i) => i);
}


  addToBasket(product: IProduct) {
    this.basketService.addItemToBasket(product, 1);
    this.toast.success('Item added to basket', 'SUCCESS');
  }
   updateSlideWidth() {
    const containerWidth = document.querySelector('.carousel-wrapper')?.clientWidth || 0;
    if (containerWidth < 576) this.visibleSlides = 1;
    else if (containerWidth < 768) this.visibleSlides = 2;
    else if (containerWidth < 992) this.visibleSlides = 3;
    else if (containerWidth < 1200) this.visibleSlides = 4;
    else this.visibleSlides = 5;

    this.slideWidth = containerWidth / this.visibleSlides;
  }

  nextSlide() {
    if (this.currentSlide < this.bestSellers.length - this.visibleSlides) this.currentSlide++;
  }

  prevSlide() {
    if (this.currentSlide > 0) this.currentSlide--;
  }
}
