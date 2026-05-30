import { Component, OnInit, HostListener } from '@angular/core';
import { CoreService } from './core/core.service';
import { ThemeService } from './core/Services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  showScrollTop = false;

  constructor(
    private coreService: CoreService,
    public themeService: ThemeService
  ) {}

  ngOnInit(): void {}

  @HostListener('window:scroll')
  onScroll() {
    this.showScrollTop = window.scrollY > 400;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
