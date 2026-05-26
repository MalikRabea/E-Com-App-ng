import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';
import { ShopService } from './shop.service';
import { ICategory } from '../shared/Models/Category';
import { IPagnation } from '../shared/Models/Pagnation';
import { IProduct } from '../shared/Models/Product';
import { ProductParam } from '../shared/Models/ProductParam';
import { ToastrService } from 'ngx-toastr';

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
  private searchTerm$ = new Subject<string>();

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
  ) {}

  ngOnInit(): void {
    this.ProductParam.SortSelected = this.SortingOption[0].value;
    this.ProductParam.pageSize = 9;

    this.route.queryParams.subscribe(params => {
      if (params['search']) {
        this.ProductParam.search = params['search'];
        if (this.searchInput) this.searchInput.nativeElement.value = params['search'];
      }
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
    this.getAllProduct();
  }

  SortingByPrice(sort: Event) {
    this.ProductParam.SortSelected = (sort.target as HTMLSelectElement).value;
    this.getAllProduct();
  }

  OnSearch(Search: string) {
    this.showSuggestions = false;
    this.ProductParam.search = Search;
    this.ProductParam.pageNumber = 1;
    this.getAllProduct();
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

  @ViewChild('search') searchInput!: ElementRef;
  @ViewChild('SortSelected') selected!: ElementRef;

  ResetValue() {
    this.ProductParam.search = '';
    this.ProductParam.SortSelected = this.SortingOption[0].value;
    this.ProductParam.CategoryId = 0;
    if (this.searchInput) this.searchInput.nativeElement.value = '';
    if (this.selected) this.selected.nativeElement.selectedIndex = 0;
    this.getAllProduct();
  }
}
