import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RatingComponent } from './rating.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [RatingComponent   ],
  imports: [
    CommonModule,
    FormsModule,
  ],
  exports: [
    RatingComponent   // هون بقدر أصدّره
  ]
})
export class RatingModule { }
