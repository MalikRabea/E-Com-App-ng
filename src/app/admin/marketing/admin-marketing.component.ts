import { Component, OnInit } from '@angular/core';
import { SupportService } from '../../core/Services/support.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-marketing',
  templateUrl: './admin-marketing.component.html',
  styleUrls: ['./admin-marketing.component.scss'],
})
export class AdminMarketingComponent implements OnInit {
  segments: any = null;
  campaigns: any[] = [];
  loading = true;
  sending = false;

  form = { subject: '', body: '', segment: 'All' };

  constructor(private support: SupportService, private toast: ToastrService) {}

  ngOnInit() {
    this.support.getSegments().subscribe({ next: (s) => { this.segments = s; this.loading = false; }, error: () => this.loading = false });
    this.loadCampaigns();
  }

  loadCampaigns() {
    this.support.getCampaigns().subscribe({ next: (c) => this.campaigns = c });
  }

  segmentCount(seg: string): number {
    if (!this.segments) return 0;
    return this.segments[seg] ?? 0;
  }

  send() {
    if (!this.form.subject.trim() || !this.form.body.trim()) {
      this.toast.warning('Subject and body required', 'Required'); return;
    }
    this.sending = true;
    this.support.sendCampaign(this.form.subject, this.form.body, this.form.segment).subscribe({
      next: (res) => {
        this.toast.success(`Campaign sent to ${res.sent} recipient(s)!`, 'Sent');
        this.form = { subject: '', body: '', segment: 'All' };
        this.sending = false;
        this.loadCampaigns();
      },
      error: () => { this.sending = false; this.toast.error('Failed to send', 'Error'); }
    });
  }
}
