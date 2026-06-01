import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-admin-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
})
export class AdminAnalyticsComponent implements OnInit {
  monthlySales:  any[] = [];
  topProducts:   any[] = [];
  categoryData:  any[] = [];
  dailyOrders:   any[] = [];
  loading = true;

  maxRevenue    = 1;
  maxTopSold    = 1;
  maxCatRev     = 1;
  maxDayCount   = 1;

  readonly monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  readonly catColors = ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#f97316','#06b6d4','#84cc16'];

  constructor(private svc: AdminService) {}

  ngOnInit() {
    Promise.all([
      this.svc.getMonthlySales().toPromise(),
      this.svc.getTopProducts().toPromise(),
      this.svc.getCategoryBreakdown().toPromise(),
      this.svc.getDailyOrders().toPromise(),
    ]).then(([monthly, top, cats, daily]) => {
      this.monthlySales = monthly  || [];
      this.topProducts  = top      || [];
      this.categoryData = cats     || [];
      this.dailyOrders  = daily    || [];

      this.maxRevenue  = Math.max(...this.monthlySales.map(m => m.revenue), 1);
      this.maxTopSold  = Math.max(...this.topProducts.map(p => p.soldCount), 1);
      this.maxCatRev   = Math.max(...this.categoryData.map(c => c.revenue), 1);
      this.maxDayCount = Math.max(...this.dailyOrders.map(d => d.count), 1);
      this.loading = false;
    }).catch(() => { this.loading = false; });
  }

  barH(val: number, max: number): number { return Math.max((val / max) * 100, 2); }
  monthName(m: number): string { return this.monthNames[m - 1] ?? ''; }
  dayLabel(iso: string): string {
    return new Date(iso).toLocaleDateString('en', { weekday: 'short' });
  }

  // SVG donut chart
  get donutSegments(): { color: string; dasharray: string; dashoffset: string; label: string; pct: number }[] {
    const total = this.categoryData.reduce((s, c) => s + c.revenue, 0) || 1;
    const C = 2 * Math.PI * 45;
    let offset = 0;
    return this.categoryData.slice(0, 7).map((c, i) => {
      const pct  = (c.revenue / total) * 100;
      const dash = (pct / 100) * C;
      const seg  = { color: this.catColors[i], dasharray: `${dash} ${C - dash}`, dashoffset: `${C - offset}`, label: c.category, pct: Math.round(pct) };
      offset += dash;
      return seg;
    });
  }
}
