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
  currentSlide: number = 0;
slideWidth: number = 300; // Adjust according to card width


  constructor(
    private shopService: ShopService,
    private basketService: BasketService,
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
  

  getArrayofRating(rating: number) {
    return Array(rating).fill(0);
  }

  addToBasket(product: IProduct) {
    this.basketService.addItemToBasket(product, 1);
    this.toast.success('Item added to basket', 'SUCCESS');
  }

nextSlide() {
  const track = document.querySelector('.carousel-track') as HTMLElement;
  const itemWidth = (track.children[0] as HTMLElement).offsetWidth + 16; // 16px gap
  const maxSlide = (track.children.length as number) - 5; // 5 كروت في اللابتوب
  this.currentSlide = Math.min(this.currentSlide + 1, maxSlide);
  track.style.transform = `translateX(-${this.currentSlide * itemWidth}px)`;
}

prevSlide() {
  const track = document.querySelector('.carousel-track') as HTMLElement;
  const itemWidth = (track.children[0] as HTMLElement).offsetWidth + 16;
  this.currentSlide = Math.max(this.currentSlide - 1, 0);
}
 

}
