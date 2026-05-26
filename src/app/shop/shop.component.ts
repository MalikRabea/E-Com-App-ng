import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  SortingOption = [
    { name: 'Default',       value: 'Name'     },
    { name: 'Price: Low → High', value: 'PriceAce' },
    { name: 'Price: High → Low', value: 'PriceDce' },
  ];

  constructor(
    private shopService: ShopService,
    private toast: ToastrService,
    private route: ActivatedRoute,
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
    this.ProductParam.search = Search;
    this.ProductParam.pageNumber = 1;
    this.getAllProduct();
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
