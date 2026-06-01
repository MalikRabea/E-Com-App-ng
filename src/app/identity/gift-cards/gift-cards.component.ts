import { Component, OnInit } from '@angular/core';
import { CommerceService } from '../../core/Services/commerce.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-gift-cards',
  templateUrl: './gift-cards.component.html',
  styleUrl: './gift-cards.component.scss'
})
export class GiftCardsComponent implements OnInit {
  tab: 'buy' | 'check' | 'mine' = 'buy';

  // Buy
  amount = 50;
  recipientEmail = '';
  message = '';
  presets = [25, 50, 100, 200];
  purchasing = false;
  lastPurchased: any = null;

  // Check
  checkCode = '';
  checkResult: any = null;
  checking = false;

  // Mine
  myCards: any[] = [];
  loadingMine = false;

  constructor(private commerce: CommerceService, private toast: ToastrService) {}

  ngOnInit() {}

  setTab(t: 'buy' | 'check' | 'mine') {
    this.tab = t;
    if (t === 'mine') this.loadMine();
  }

  purchase() {
    if (this.amount < 5) { this.toast.warning('Minimum is $5', 'Amount'); return; }
    this.purchasing = true;
    this.commerce.purchaseGiftCard(this.amount, this.recipientEmail || undefined, this.message || undefined).subscribe({
      next: (res) => {
        this.lastPurchased = res;
        this.purchasing = false;
        this.toast.success('Gift card created!', 'Success');
      },
      error: () => { this.purchasing = false; this.toast.error('Purchase failed', 'Error'); }
    });
  }

  check() {
    if (!this.checkCode.trim()) return;
    this.checking = true;
    this.checkResult = null;
    this.commerce.checkGiftCardBalance(this.checkCode.trim().toUpperCase()).subscribe({
      next: (res) => { this.checkResult = res; this.checking = false; },
      error: () => { this.checking = false; this.toast.error('Gift card not found', 'Error'); }
    });
  }

  loadMine() {
    this.loadingMine = true;
    this.commerce.myGiftCards().subscribe({
      next: (cards) => { this.myCards = cards; this.loadingMine = false; },
      error: () => { this.loadingMine = false; }
    });
  }

  copyCode(code: string) {
    navigator.clipboard.writeText(code).then(() => this.toast.success('Code copied!', 'Copied'));
  }
}
