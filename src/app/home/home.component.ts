import { Component, OnInit } from '@angular/core';
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
export class HomeComponent implements OnInit {
  email = '';
  featuredProducts: IProduct[] = [];
  featuredLoading = true;
  imgUrl = environment.imageUrl;
  skeletons = Array(8);

  categories = [
    { id: 1, name: 'Laptops',       icon: 'laptop',       color: 'rgba(37,99,235,.12)',   count: 48 },
    { id: 2, name: 'Smartphones',   icon: 'smartphone',   color: 'rgba(245,158,11,.12)',  count: 94 },
    { id: 3, name: 'Headphones',    icon: 'headphones',   color: 'rgba(16,185,129,.12)',  count: 32 },
    { id: 4, name: 'Cameras',       icon: 'camera_alt',   color: 'rgba(239,68,68,.12)',   count: 21 },
    { id: 5, name: 'Tablets',       icon: 'tablet',       color: 'rgba(139,92,246,.12)',  count: 17 },
    { id: 6, name: 'Smart Watches', icon: 'watch',        color: 'rgba(236,72,153,.12)',  count: 29 },
  ];

  constructor(
    private shopService: ShopService,
    private basketService: BasketService,
    private toast: ToastrService
  ) {}

  ngOnInit() {
    const params = new ProductParam();
    params.pageSize = 8;
    params.pageNumber = 1;
    this.shopService.getProduct(params).subscribe({
      next: (res) => {
        this.featuredProducts = res.data;
        this.featuredLoading = false;
      },
      error: () => { this.featuredLoading = false; }
    });
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

  subscribeNewsletter() {
    if (!this.email.trim()) return;
    this.email = '';
  }
}
