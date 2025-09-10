import { Component, Input, OnInit } from '@angular/core';
import { IProduct } from '../shared/Models/Product';
import { IRating } from '../shared/Models/rating';
import { RatingService } from './rating.service';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit {
  @Input() product: IProduct; // نجيب المنتج من الأب (مثلاً checkout-success)
  mainImage: string;
  newRating: IRating = { productId: 0, stars: 0, content: '' };

  constructor(private ratingService: RatingService) {}

  ngOnInit(): void {
    if (this.product) {
      this.newRating.productId = this.product.id;
      this.setDefaultImage();
    }
  }

  private setDefaultImage() {
    if (this.product?.photos && this.product.photos.length > 0) {
      this.mainImage = 'https://e-com-app-xfqq.onrender.com/' + this.product.photos[0].imageName;
    } else {
      this.mainImage = 'assets/no-image.png';
    }
  }

  changeMainImage(img: string) {
    this.mainImage = 'https://e-com-app-xfqq.onrender.com/' + img;
  }

  submitRating() {
    if (!this.newRating.stars) return;

    this.ratingService.addRating(this.newRating).subscribe({
      next: () => {
        alert('✅ شكراً على تقييمك!');
        this.newRating.stars = 0;
        this.newRating.content = '';
      },
      error: (err) => console.error(err)
    });
  }
}
