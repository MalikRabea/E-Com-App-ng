import { Component, OnInit } from '@angular/core';
import { CoreService } from './core/core.service';
import { ThemeService } from './core/Services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  constructor(
    private coreService: CoreService,
    public themeService: ThemeService
  ) {}

  ngOnInit(): void {}
}
