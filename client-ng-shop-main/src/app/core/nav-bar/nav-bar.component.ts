import { FavoriteService } from './../../favorite/favorite.service';
import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { BasketService } from '../../basket/basket.service';
import { Observable } from 'rxjs';
import { IBasket } from '../../shared/Models/Basket';
import { CoreService } from '../core.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  userName: string = '';
  visibale: boolean = false;
  count: Observable<IBasket>;
  favoriteCount: number = 0; // عدد المفضلات
  @ViewChild('dropdown') dropdown!: ElementRef;

  constructor(
    private basketService: BasketService,
    private coreService: CoreService,
    private router: Router,
    private favoriteService: FavoriteService
  ) {}

  ngOnInit(): void {
    const basketId = localStorage.getItem('basketId');

    // جلب basket count
    this.basketService.GetBasket(basketId).subscribe({
      next: () => {
        this.count = this.basketService.basket$;
      },
      error(err) {
        console.log(err);
      },
    });

    // جلب اسم المستخدم وتحديث الـ BehaviorSubject
    this.coreService.getUserName().subscribe();
    this.coreService.userName$.subscribe(username => {
      this.userName = username;

      if (username) {
        // جلب كل المفضلات وحساب العدد مباشرة
        this.favoriteService.getFavorites().subscribe({
          next: (data) => {
            this.favoriteService.setFavoriteCount(data.length);
          },
          error: (err) => console.error(err)
        });

        // الاشتراك على الـ BehaviorSubject لتحديث العدد تلقائياً
        this.favoriteService.favoriteCount$.subscribe(count => {
          this.favoriteCount = count;
        });
      }
    });
  }

  logout() {
    this.coreService.logout().subscribe({
      next: () => {
        this.router.navigateByUrl('/');
      },
      error: (err) => console.error("Logout failed", err)
    });
  }

  ToggleDropDown() {
    this.visibale = !this.visibale;
  }

  closeDropdown() {
  this.visibale = false;
}

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (this.visibale && this.dropdown && !this.dropdown.nativeElement.contains(event.target)) {
      this.visibale = false;
    }
  }
}
