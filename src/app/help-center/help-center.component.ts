import { Component, OnInit } from '@angular/core';
import { SupportService } from '../core/Services/support.service';
import { CoreService } from '../core/core.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-help-center',
  templateUrl: './help-center.component.html',
  styleUrl: './help-center.component.scss'
})
export class HelpCenterComponent implements OnInit {
  tab: 'faq' | 'tickets' | 'new' = 'faq';

  // FAQ
  faqs: any[] = [];
  faqSearch = '';
  openFaqId: number | null = null;
  loadingFaq = true;

  // Tickets
  tickets: any[] = [];
  loadingTickets = false;
  activeThread: any = null;
  replyBody = '';

  // New ticket
  newTicket = { subject: '', category: 'General', message: '' };
  categories = ['General', 'Order', 'Payment', 'Product', 'Other'];
  creating = false;

  isLoggedIn = false;

  constructor(
    private support: SupportService,
    private core: CoreService,
    private toast: ToastrService
  ) {}

  ngOnInit() {
    this.loadFaqs();
    this.core.userName$.subscribe(u => this.isLoggedIn = !!u);
  }

  setTab(t: 'faq' | 'tickets' | 'new') {
    this.tab = t;
    if (t === 'tickets') this.loadTickets();
  }

  // ── FAQ ──
  loadFaqs() {
    this.loadingFaq = true;
    this.support.getFaqs().subscribe({
      next: (data) => { this.faqs = data; this.loadingFaq = false; },
      error: () => { this.loadingFaq = false; }
    });
  }

  get filteredFaqs() {
    if (!this.faqSearch.trim()) return this.faqs;
    const q = this.faqSearch.toLowerCase();
    return this.faqs.filter(f => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q));
  }

  get faqCategories(): string[] {
    return Array.from(new Set(this.filteredFaqs.map(f => f.category)));
  }
  faqsInCategory(cat: string) { return this.filteredFaqs.filter(f => f.category === cat); }

  toggleFaq(id: number) { this.openFaqId = this.openFaqId === id ? null : id; }

  // ── Tickets ──
  loadTickets() {
    this.loadingTickets = true;
    this.support.myTickets().subscribe({
      next: (data) => { this.tickets = data; this.loadingTickets = false; },
      error: () => { this.loadingTickets = false; }
    });
  }

  openThread(id: number) {
    this.support.ticketThread(id).subscribe({
      next: (data) => { this.activeThread = data; }
    });
  }
  closeThread() { this.activeThread = null; }

  sendReply() {
    if (!this.replyBody.trim() || !this.activeThread) return;
    this.support.reply(this.activeThread.id, this.replyBody).subscribe({
      next: () => {
        this.activeThread.messages.push({ body: this.replyBody, isAdmin: false, createdAt: new Date().toISOString() });
        this.replyBody = '';
        this.toast.success('Reply sent');
      }
    });
  }

  // ── New ticket ──
  submitTicket() {
    if (!this.newTicket.subject.trim() || !this.newTicket.message.trim()) {
      this.toast.warning('Please fill in all fields', 'Required'); return;
    }
    this.creating = true;
    this.support.createTicket(this.newTicket.subject, this.newTicket.category, this.newTicket.message).subscribe({
      next: () => {
        this.toast.success('Ticket created! Our team will respond soon.', 'Submitted');
        this.newTicket = { subject: '', category: 'General', message: '' };
        this.creating = false;
        this.setTab('tickets');
      },
      error: () => {
        this.creating = false;
        this.toast.error('Please sign in to create a ticket', 'Login Required');
      }
    });
  }

  statusClass(s: string) {
    return s === 'Resolved' || s === 'Closed' ? 'st-resolved' : s === 'Pending' ? 'st-pending' : 'st-open';
  }
}
