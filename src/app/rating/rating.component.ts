// src/app/rating/rating.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { RatingService } from './rating.service';
import { IRating } from '../shared/Models/rating';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit {
  @Input() product: any;
  ratings: IRating[] = [];
  stars = 0;
  content = '';

  constructor(private ratingService: RatingService, private toastr: ToastrService) {}

  ngOnInit(): void {
    if (this.product?.id) {
      this.loadRatings();
    }
  }

  loadRatings() {
    this.ratingService.getRatings(this.product.id).subscribe({
      next: (res) => this.ratings = res,
      error: (err) => console.error(err)
    });
  }

  submitRating() {
    if (!this.stars) {
      this.toastr.warning('اختر عدد النجوم أولاً');
      return;
    }

    const newRating: IRating = {
      productId: this.product.id,
      stars: this.stars,
      content: this.content   // بدل comment
    };

    this.ratingService.addRating(newRating).subscribe({
      next: () => {
        this.toastr.success('تم إضافة تقييمك 👌');
        this.stars = 0;
        this.content = '';
        this.loadRatings();
      },
      error: () => this.toastr.error('حدث خطأ أثناء إضافة التقييم')
    });
  }
}
