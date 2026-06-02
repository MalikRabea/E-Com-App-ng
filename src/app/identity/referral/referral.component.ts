import { Component, OnInit } from '@angular/core';
import { SupportService } from '../../core/Services/support.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-referral',
  templateUrl: './referral.component.html',
  styleUrl: './referral.component.scss'
})
export class ReferralComponent implements OnInit {
  data: any = null;
  loading = true;

  constructor(private support: SupportService, private toast: ToastrService) {}

  ngOnInit() {
    this.support.myReferral().subscribe({
      next: (d) => { this.data = d; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  get shareLink(): string {
    return `${window.location.origin}/Account/Register?ref=${this.data?.code}`;
  }

  copyCode() {
    navigator.clipboard.writeText(this.data.code).then(() => this.toast.success('Code copied!', 'Copied'));
  }
  copyLink() {
    navigator.clipboard.writeText(this.shareLink).then(() => this.toast.success('Invite link copied!', 'Copied'));
  }

  shareVia(platform: 'whatsapp' | 'native') {
    const text = `Join E-Shop with my code ${this.data.code} and we both earn rewards! ${this.shareLink}`;
    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    } else if (navigator.share) {
      navigator.share({ title: 'Join E-Shop', text, url: this.shareLink }).catch(() => {});
    }
  }
}
