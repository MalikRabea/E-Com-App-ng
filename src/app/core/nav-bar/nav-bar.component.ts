import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BasketService } from '../../basket/basket.service';
import { FavoriteService } from '../../favorite/favorite.service';
import { CoreService } from '../core.service';
import { ThemeService } from '../Services/theme.service';
import { NotificationService, INotification } from '../Services/notification.service';
import { IBasket } from '../../shared/Models/Basket';
import { environment } from '../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  userName = '';
  isAdmin = false;
  visibale = false;
  mobileOpen = false;
  isDark = false;
  notifOpen = false;
  searchFocused = false;
  currentLang = 'en';
  count: Observable<IBasket>;
  favoriteCount = 0;
  notifications: INotification[] = [];
  unreadCount = 0;
  recentSearches: string[] = [];
  private readonly RS_KEY = 'recentSearches';

  @ViewChild('dropdown') dropdown!: ElementRef;
  @ViewChild('notifDropdown') notifDropdown!: ElementRef;

  constructor(
    private basketService: BasketService,
    private coreService: CoreService,
    private router: Router,
    private favoriteService: FavoriteService,
    private themeService: ThemeService,
    private http: HttpClient,
    public notifService: NotificationService,
    private translate: TranslateService
  ) {
    const saved = localStorage.getItem('lang') || 'en';
    this.currentLang = saved;
    this.translate.use(saved);
    document.documentElement.dir  = saved === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = saved;
  }

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
        this.http.get<{ isAdmin: boolean }>(`${environment.baseURL}Account/is-admin`, { withCredentials: true }).subscribe({
          next: (res) => (this.isAdmin = res.isAdmin),
          error: () => (this.isAdmin = false),
        });
        this.notifService.startPolling();
      } else {
        this.isAdmin = false;
        this.notifService.stopPolling();
      }
    });

    this.themeService.isDark.subscribe(dark => (this.isDark = dark));

    this.notifService.notifications$.subscribe(n => (this.notifications = n));
    this.notifService.unreadCount$.subscribe(c => (this.unreadCount = c));
    this.recentSearches = JSON.parse(localStorage.getItem(this.RS_KEY) || '[]');
  }

  toggleTheme() { this.themeService.toggle(); }

  toggleLang() {
    this.currentLang = this.currentLang === 'en' ? 'ar' : 'en';
    this.translate.use(this.currentLang);
    localStorage.setItem('lang', this.currentLang);
    document.documentElement.dir  = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = this.currentLang;
  }

  toggleNotif() {
    this.notifOpen = !this.notifOpen;
    if (this.notifOpen) this.notifService.refresh();
  }
  closeNotif()  { this.notifOpen = false; }

  onNotifClick(n: INotification) {
    this.notifService.markRead(n.id);
    if (n.link) this.router.navigateByUrl(n.link);
    this.notifOpen = false;
  }

  timeAgo(iso: string): string {
    const diff = (Date.now() - new Date(iso).getTime()) / 1000;
    if (diff < 60)   return 'Just now';
    if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
    if (diff < 86400)return Math.floor(diff / 3600) + 'h ago';
    return Math.floor(diff / 86400) + 'd ago';
  }

  logout() {
    this.coreService.logout().subscribe({
      next: () => {
        this.favoriteService.setFavoriteCount(0);
        this.favoriteCount = 0;
        this.notifService.stopPolling();
        this.isAdmin = false;
        this.router.navigateByUrl('/');
      },
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
      this.saveRecentSearch(q);
      this.searchFocused = false;
      this.router.navigate(['/shop'], { queryParams: { search: q } });
    }
  }

  saveRecentSearch(term: string) {
    const list: string[] = JSON.parse(localStorage.getItem(this.RS_KEY) || '[]');
    const filtered = list.filter(s => s !== term);
    filtered.unshift(term);
    const updated = filtered.slice(0, 6);
    localStorage.setItem(this.RS_KEY, JSON.stringify(updated));
    this.recentSearches = updated;
  }

  removeRecentSearch(term: string, e: Event) {
    e.stopPropagation();
    this.recentSearches = this.recentSearches.filter(s => s !== term);
    localStorage.setItem(this.RS_KEY, JSON.stringify(this.recentSearches));
  }

  clearRecentSearches() {
    this.recentSearches = [];
    localStorage.removeItem(this.RS_KEY);
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (this.visibale && this.dropdown && !this.dropdown.nativeElement.contains(event.target)) {
      this.visibale = false;
    }
    if (this.notifOpen && this.notifDropdown && !this.notifDropdown.nativeElement.contains(event.target)) {
      this.notifOpen = false;
    }
  }
}
