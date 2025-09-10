import { Component, OnInit } from '@angular/core';
import { ShopService } from '../shop.service';
import { IProduct } from '../../shared/Models/Product';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BasketService } from '../../basket/basket.service';
import { IReview } from '../../shared/Models/review';
import { FavoriteService } from '../../favorite/favorite.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit {
  constructor(
    private shopService: ShopService,
    private route: ActivatedRoute,
    private toast:ToastrService,
    private basketService:BasketService,
    private favoriteService: FavoriteService
    
  ) {}
  reviews:IReview[]=[]
  qunatity: number = 1;
  product: IProduct;
  loading:boolean=false;
  ngOnInit(): void {
    this.loadProduct();
  }
  MainImage: string;
  loadProduct() {
    this.shopService
      .getProductDetails(parseInt(this.route.snapshot.paramMap.get('id')))
      .subscribe({
        next: (value: IProduct) => {
          this.product = value;
          this.MainImage = this.product.photos[0].imageName;
          console.log(this.product);
        },
      });
  }
  ReplaceImage(src: string) {
    this.MainImage = src;
  }
  incrementBasket() {
    if(this.qunatity<10){
      this.qunatity++;
      this.toast.success("item has been added to the basket","SUCCESS")
    }else{
      this.toast.warning("You can't add more than 10 items","Enough")
    }
  }
  DecrementBasket() {
    if(this.qunatity>1){
      this.qunatity--;
      this.toast.warning("item has been Decrement","SUCCESS")
    }else{
      this.toast.error("You can't Decrement more than 1 items","ERROR")
    }
  }
  AddToBasket(){
    this.basketService.addItemToBasket(this.product,this.qunatity)
    this.toast.success("item has been added to basket","SUCCESS")
  }
  CalucateDiscount(oldPrice:number,newPrice:number):number{
    return parseFloat(
    Math.round(((oldPrice-newPrice)/oldPrice)*100).toFixed(1)      
    )
  }
  showReview(id:number){
    this.loading=true
    this.shopService.getProductRating(id).subscribe({
      next:res=>{
        this.loading=false
        this.reviews=res
      },error(err) {
        console.log(err);
        
      },
    })
  }
  addToFavorites(productId: number) {
  this.favoriteService.addToFavorites(productId).subscribe({
    next: () => {
      this.favoriteService.incrementFavoriteCount();
    },
    error: (err) => console.error(err)
  });
}
}

