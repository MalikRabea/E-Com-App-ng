import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  email = '';

  heroTitle = 'Discover the Latest Electronics';
  heroSubtitle = 'High-quality gadgets at unbeatable prices.';

  categories = [
    { id: 1, name: 'Laptops',      icon: 'laptop',        color: 'rgba(37,99,235,.12)',   count: 48 },
    { id: 2, name: 'Smartphones',  icon: 'smartphone',    color: 'rgba(245,158,11,.12)',  count: 94 },
    { id: 3, name: 'Headphones',   icon: 'headphones',    color: 'rgba(16,185,129,.12)',  count: 32 },
    { id: 4, name: 'Cameras',      icon: 'camera_alt',    color: 'rgba(239,68,68,.12)',   count: 21 },
    { id: 5, name: 'Tablets',      icon: 'tablet',        color: 'rgba(139,92,246,.12)',  count: 17 },
    { id: 6, name: 'Smart Watches',icon: 'watch',         color: 'rgba(236,72,153,.12)',  count: 29 },
  ];

  featuredProducts = [
    { name: 'MacBook Pro M3',  price: '25%', image: 'https://m.media-amazon.com/images/I/61LdecwlWYL.jpg' },
    { name: 'iPhone 16 Pro',   price: '11%', image: 'https://themewagon.github.io/MiniStore/images/product-item4.jpg' },
    { name: 'Sony WH-1000XM5', price: '18%', image: 'https://img.freepik.com/premium-photo/headphones-connected-smartphone-pink-blue-background_175682-4238.jpg' },
    { name: 'Apple Watch Ultra',price: '10%', image: 'https://themewagon.github.io/MiniStore/images/product-item7.jpg' },
    { name: 'PS5 Console',     price: '15%', image: 'https://img.choice.com.au/-/media/8dde4d457b924083b0547305a77ebfe9.ashx' },
    { name: 'Sony A7 IV',      price: '22%', image: 'https://i5.walmartimages.com/asr/f7837d96-46a9-4a93-b2ae-7aae9d4a34b7.ee7886a1edadebb5617039a832aef144.jpeg' },
    { name: 'iPad Pro 13"',    price: '20%', image: 'https://m.media-amazon.com/images/I/71pMKb47muL._AC_SL1500_.jpg' },
  ];

  ngOnInit() {}

  subscribeNewsletter() {
    if (!this.email.trim()) return;
    this.email = '';
  }
}
