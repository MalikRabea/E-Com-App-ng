import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'eshop-theme';
  private isDark$ = new BehaviorSubject<boolean>(false);

  isDark = this.isDark$.asObservable();

  constructor() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const dark = saved ? saved === 'dark' : prefersDark;
    this.setDark(dark);
  }

  toggle() {
    this.setDark(!this.isDark$.value);
  }

  get currentIsDark(): boolean {
    return this.isDark$.value;
  }

  private setDark(dark: boolean) {
    this.isDark$.next(dark);
    localStorage.setItem(this.STORAGE_KEY, dark ? 'dark' : 'light');
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}
