import { Component, OnInit } from '@angular/core';
import { SupportService } from '../../core/Services/support.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-support',
  templateUrl: './admin-support.component.html',
  styleUrls: ['./admin-support.component.scss'],
})
export class AdminSupportComponent implements OnInit {
  tickets: any[] = [];
  loading = true;
  statusFilter = '';
  thread: any = null;
  replyBody = '';

  readonly statuses = ['Open', 'Pending', 'Resolved', 'Closed'];

  constructor(private support: SupportService, private toast: ToastrService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.support.allTickets(this.statusFilter).subscribe({
      next: (data) => { this.tickets = data; this.loading = false; },
      error: () => (this.loading = false),
    });
  }

  open(id: number) {
    this.support.ticketThread(id).subscribe({ next: (d) => this.thread = d });
  }
  close() { this.thread = null; }

  reply() {
    if (!this.replyBody.trim() || !this.thread) return;
    this.support.reply(this.thread.id, this.replyBody).subscribe({
      next: () => {
        this.thread.messages.push({ body: this.replyBody, isAdmin: true, createdAt: new Date().toISOString() });
        this.replyBody = '';
        this.toast.success('Reply sent');
      }
    });
  }

  setStatus(status: string) {
    if (!this.thread) return;
    this.support.setTicketStatus(this.thread.id, status).subscribe({
      next: () => {
        this.thread.status = status;
        const t = this.tickets.find(x => x.id === this.thread.id);
        if (t) t.status = status;
        this.toast.success(`Marked as ${status}`);
      }
    });
  }

  statusClass(s: string) {
    return s === 'Resolved' || s === 'Closed' ? 'status-success' : s === 'Pending' ? 'status-pending' : 'status-shipped';
  }
}
