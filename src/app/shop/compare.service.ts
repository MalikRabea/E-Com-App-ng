import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IProduct } from '../shared/Models/Product';

@Injectable({ providedIn: 'root' })
export class CompareService {
  private readonly MAX = 3;
  private items$ = new BehaviorSubject<IProduct[]>([]);
  compare$ = this.items$.asObservable();

  get items(): IProduct[] { return this.items$.value; }

  add(product: IProduct): boolean {
    const current = this.items$.value;
    if (current.find(p => p.id === product.id)) return false;
    if (current.length >= this.MAX) return false;
    this.items$.next([...current, product]);
    return true;
  }

  remove(id: number) {
    this.items$.next(this.items$.value.filter(p => p.id !== id));
  }

  clear() { this.items$.next([]); }

  isAdded(id: number): boolean {
    return this.items$.value.some(p => p.id === id);
  }
}
