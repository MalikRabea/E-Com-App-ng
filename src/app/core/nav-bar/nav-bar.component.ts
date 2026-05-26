import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { BasketService } from '../../basket/basket.service';
import { FavoriteService } from '../../favorite/favorite.service';
import { CoreService } from '../core.service';
import { ThemeService } from '../Services/theme.service';
import { IBasket } from '../../shared/Models/Basket';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  userName = '';
  visibale = false;
  mobileOpen = false;
  isDark = false;
  count: Observable<IBasket>;
  favoriteCount = 0;

  @ViewChild('dropdown') dropdown!: ElementRef;

  constructor(
    private basketService: BasketService,
    private coreService: CoreService,
    private router: Router,
    private favoriteService: FavoriteService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    const basketId = localStorage.getItem('basketId');
    this.basketService.GetBasket(basketId).subscribe({
      next: () => { this.count = this.basketService.basket$; },
      error: (err) => console.log(err),
    });

    this.coreService.getUserName().subscribe();
    this.coreService.userName$.subscribe(username => {
      this.userName = username;
      if (username) {
        this.favoriteService.getFavorites().subscribe({
          next: (data) => this.favoriteService.setFavoriteCount(data.length),
          error: (err) => console.error(err),
        });
        this.favoriteService.favoriteCount$.subscribe(c => (this.favoriteCount = c));
      }
    });

    this.themeService.isDark.subscribe(dark => (this.isDark = dark));
  }

  toggleTheme() { this.themeService.toggle(); }

  logout() {
    this.coreService.logout().subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: (err) => console.error('Logout failed', err),
    });
  }

  ToggleDropDown() { this.visibale = !this.visibale; }
  closeDropdown()  { this.visibale = false; }
  toggleMobileMenu() { this.mobileOpen = !this.mobileOpen; }
  closeMobileMenu()  { this.mobileOpen = false; }

  onSearchNav(value: string) {
    const q = value.trim();
    if (q) {
      this.router.navigate(['/shop'], { queryParams: { search: q } });
    }
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (this.visibale && this.dropdown && !this.dropdown.nativeElement.contains(event.target)) {
      this.visibale = false;
    }
  }
}
