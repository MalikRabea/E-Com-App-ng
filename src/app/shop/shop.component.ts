import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';
import { ShopService } from './shop.service';
import { ICategory } from '../shared/Models/Category';
import { IPagnation } from '../shared/Models/Pagnation';
import { IProduct } from '../shared/Models/Product';
import { ProductParam } from '../shared/Models/ProductParam';
import { ToastrService } from 'ngx-toastr';
import { CompareService } from './compare.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit {
  product: IProduct[] = [];
  Cateogry: ICategory[] = [];
  TotatlCount = 0;
  ProductParam = new ProductParam();
  loading = true;
  quickViewProduct: IProduct | null = null;
  suggestions: IProduct[] = [];
  showSuggestions = false;
  showCompareModal = false;
  private searchTerm$ = new Subject<string>();

  priceMin = 0;
  priceMax = 9999;
  priceRangeMax = 9999;
  inStockOnly = false;
  minRating = 0;
  onSaleOnly = false;

  viewMode: 'grid' | 'list' = 'grid';
  recentlyViewed: IProduct[] = [];

  get displayProducts(): IProduct[] {
    let list = this.product;
    if (this.inStockOnly) list = list.filter(p => p.stockQuantity > 0);
    if (this.onSaleOnly)  list = list.filter(p => p.oldPrice > p.newPrice);
    if (this.minRating > 0) list = list.filter(p => (p.rating ?? 0) >= this.minRating);
    return list;
  }

  get priceFilterActive(): boolean {
    return this.priceMin > 0 || this.priceMax < this.priceRangeMax || this.inStockOnly
        || this.onSaleOnly || this.minRating > 0;
  }

  get selectedCategoryName(): string {
    return this.Cateogry.find(c => c.id === this.ProductParam.CategoryId)?.name ?? '';
  }

  SortingOption = [
    { name: 'Default',       value: 'Name'     },
    { name: 'Price: Low → High', value: 'PriceAce' },
    { name: 'Price: High → Low', value: 'PriceDce' },
  ];

  constructor(
    private shopService: ShopService,
    private toast: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    public compareService: CompareService,
  ) {}

  ngOnInit(): void {
    this.ProductParam.SortSelected = this.SortingOption[0].value;
    this.ProductParam.pageSize = 9;
    this.viewMode = (localStorage.getItem('shopView') as 'grid' | 'list') || 'grid';
    this.loadRecentlyViewed();

    this.route.queryParams.subscribe(params => {
      if (params['search']) {
        this.ProductParam.search = params['search'];
        if (this.searchInput) this.searchInput.nativeElement.value = params['search'];
      }
      if (params['category']) this.ProductParam.CategoryId = +params['category'];
      this.getAllProduct();
    });

    this.getCategory();

    this.searchTerm$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => term.length >= 2 ? this.shopService.getSearchSuggestions(term) : of(null))
    ).subscribe(res => {
      this.suggestions = res ? res.data.slice(0, 5) : [];
      this.showSuggestions = this.suggestions.length > 0;
    });
  }

  getAllProduct() {
    this.loading = true;
    this.shopService.getProduct(this.ProductParam).subscribe({
      next: (value: IPagnation) => {
        this.product = value.data;
        this.TotatlCount = value.totalCount;
        this.ProductParam.pageNumber = value.pageNumber;
        this.ProductParam.pageSize = value.pageSize;
        this.loading = false;
        if (value.data.length > 0) {
          const maxP = Math.max(...value.data.map(p => p.newPrice));
          this.priceRangeMax = Math.ceil(maxP / 10) * 10 || 9999;
          if (!this.priceFilterActive) this.priceMax = this.priceRangeMax;
        }
      },
      error: () => { this.loading = false; },
    });
  }

  getCategory() {
    this.shopService.getCategory().subscribe({
      next: (value) => (this.Cateogry = value),
    });
  }

  SelectedId(categoryid: number) {
    this.ProductParam.CategoryId = categoryid;
    this.ProductParam.pageNumber = 1;
    this.syncUrl();
    this.getAllProduct();
  }

  private syncUrl() {
    const queryParams: any = {};
    if (this.ProductParam.search)     queryParams.search = this.ProductParam.search;
    if (this.ProductParam.CategoryId) queryParams.category = this.ProductParam.CategoryId;
    this.router.navigate([], { relativeTo: this.route, queryParams, replaceUrl: true });
  }

  setView(mode: 'grid' | 'list') {
    this.viewMode = mode;
    localStorage.setItem('shopView', mode);
  }

  setRating(stars: number) {
    this.minRating = this.minRating === stars ? 0 : stars;
  }

  private loadRecentlyViewed() {
    try {
      const stored: IProduct[] = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      this.recentlyViewed = stored.slice(0, 6);
    } catch { this.recentlyViewed = []; }
  }

  // Active filter chips
  get activeChips(): { label: string; clear: () => void }[] {
    const chips: { label: string; clear: () => void }[] = [];
    if (this.ProductParam.search)
      chips.push({ label: `"${this.ProductParam.search}"`, clear: () => this.OnSearch('') });
    if (this.ProductParam.CategoryId)
      chips.push({ label: this.selectedCategoryName, clear: () => this.SelectedId(0) });
    if (this.priceMin > 0 || this.priceMax < this.priceRangeMax)
      chips.push({ label: `$${this.priceMin} - $${this.priceMax}`, clear: () => { this.priceMin = 0; this.priceMax = this.priceRangeMax; this.applyLocalFilters(); } });
    if (this.inStockOnly)
      chips.push({ label: 'In Stock', clear: () => { this.inStockOnly = false; } });
    if (this.onSaleOnly)
      chips.push({ label: 'On Sale', clear: () => { this.onSaleOnly = false; } });
    if (this.minRating > 0)
      chips.push({ label: `${this.minRating}★ & up`, clear: () => { this.minRating = 0; } });
    return chips;
  }

  SortingByPrice(sort: Event) {
    this.ProductParam.SortSelected = (sort.target as HTMLSelectElement).value;
    this.getAllProduct();
  }

  OnSearch(Search: string) {
    this.showSuggestions = false;
    this.ProductParam.search = Search;
    this.ProductParam.pageNumber = 1;
    this.syncUrl();
    this.getAllProduct();
  }

  getStars(rating: number | undefined): number[] {
    return Array(Math.min(Math.max(Math.round(rating || 0), 0), 5)).fill(0);
  }
  getEmptyStars(rating: number | undefined): number[] {
    return Array(5 - Math.min(Math.max(Math.round(rating || 0), 0), 5)).fill(0);
  }
  getDiscount(p: IProduct): number {
    if (!p.oldPrice || p.oldPrice <= p.newPrice) return 0;
    return Math.round(((p.oldPrice - p.newPrice) / p.oldPrice) * 100);
  }

  onSearchInput(value: string) {
    this.searchTerm$.next(value);
    if (!value) this.showSuggestions = false;
  }

  selectSuggestion(product: IProduct) {
    this.showSuggestions = false;
    this.router.navigate(['/shop/product-details', product.id]);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.search-bar')) this.showSuggestions = false;
  }

  OnChangePage(event: any) {
    if (this.ProductParam.pageNumber !== event) {
      this.ProductParam.pageNumber = event;
      this.getAllProduct();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  openQuickView(product: IProduct) {
    this.quickViewProduct = product;
    document.body.style.overflow = 'hidden';
  }

  closeQuickView() {
    this.quickViewProduct = null;
    document.body.style.overflow = '';
  }

  get skeletonArray() { return Array(9); }

  openCompareModal() { this.showCompareModal = true; document.body.style.overflow = 'hidden'; }
  closeCompareModal() { this.showCompareModal = false; document.body.style.overflow = ''; }

  getCompareKeys(): string[] {
    return ['name', 'categoryName', 'newPrice', 'oldPrice', 'rating', 'stockQuantity', 'description'];
  }

  getCompareLabel(key: string): string {
    const map: Record<string, string> = {
      name: 'Name', categoryName: 'Category', newPrice: 'Price',
      oldPrice: 'Old Price', rating: 'Rating', stockQuantity: 'Stock', description: 'Description'
    };
    return map[key] ?? key;
  }

  getCompareValue(product: IProduct, key: string): string {
    const v = (product as any)[key];
    if (key === 'newPrice' || key === 'oldPrice') return v != null ? '$' + Number(v).toFixed(2) : '-';
    if (key === 'rating') return v ? Number(v).toFixed(1) : 'N/A';
    if (key === 'stockQuantity') return v != null ? (v > 0 ? v + ' in stock' : 'Out of stock') : '-';
    if (key === 'description') return v ? (v.length > 80 ? v.slice(0, 80) + '…' : v) : '-';
    return v ?? '-';
  }

  @ViewChild('search') searchInput!: ElementRef;
  @ViewChild('SortSelected') selected!: ElementRef;

  applyLocalFilters() {
    if (this.priceMin < 0) this.priceMin = 0;
    if (this.priceMax < this.priceMin) this.priceMax = this.priceMin;
    // Send price filter to API
    this.ProductParam.minPrice = this.priceMin > 0 ? this.priceMin : undefined;
    this.ProductParam.maxPrice = this.priceMax < this.priceRangeMax ? this.priceMax : undefined;
    this.ProductParam.pageNumber = 1;
    this.getAllProduct();
  }

  resetPriceFilter() {
    this.priceMin = 0;
    this.priceMax = this.priceRangeMax;
    this.inStockOnly = false;
    this.onSaleOnly = false;
    this.minRating = 0;
    this.ProductParam.minPrice = undefined;
    this.ProductParam.maxPrice = undefined;
    this.getAllProduct();
  }

  ResetValue() {
    this.ProductParam.search = '';
    this.ProductParam.SortSelected = this.SortingOption[0].value;
    this.ProductParam.CategoryId = 0;
    if (this.searchInput) this.searchInput.nativeElement.value = '';
    if (this.selected) this.selected.nativeElement.selectedIndex = 0;
    this.resetPriceFilter();
    this.getAllProduct();
  }
}
