import { Component, OnInit } from '@angular/core';
import { FavoriteService } from './favorite.service';
import { BasketService } from '../basket/basket.service';
import { Product } from '../shared/Models/Favorites';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent implements OnInit {
  favorites: Product[] = [];

  constructor(
    private favoriteService: FavoriteService,
    private basketService: BasketService
  ) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites() {
    this.favoriteService.getFavorites().subscribe({
      next: (data: Product[]) => {
        this.favorites = data;
        this.favoriteService.setFavoriteCount(this.favorites.length);
        console.log('Favorites loaded:', this.favorites);
      },
      error: (err) => console.error(err)
    });
  }

  removeFavorite(productId: number) {
    this.favoriteService.removeFromFavorites(productId).subscribe({
      next: () => {
        this.favorites = this.favorites.filter(p => p.id !== productId);
        this.favoriteService.setFavoriteCount(this.favorites.length);
      },
      error: (err) => console.error(err)
    });
  }

  getArrayofRating(rate: number): number[] {
    return Array(rate).fill(0).map((_, i) => i);
  }
}
