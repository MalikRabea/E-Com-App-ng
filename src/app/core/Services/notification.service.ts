import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface INotification {
  id: string;
  type: 'order' | 'promo' | 'info' | 'success' | 'warning' | 'support';
  icon: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  link?: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private base = environment.baseURL + 'Notifications';
  private subject = new BehaviorSubject<INotification[]>([]);
  private pollTimer: any;
  private isAuthed = false;

  notifications$ = this.subject.asObservable();
  unreadCount$   = this.notifications$.pipe(map(n => n.filter(x => !x.read).length));

  constructor(private http: HttpClient) {}

  /** Called by navbar once the user is known to be logged in */
  startPolling() {
    if (this.isAuthed) return;
    this.isAuthed = true;
    this.refresh();
    this.pollTimer = setInterval(() => this.refresh(), 45000); // every 45s
  }

  stopPolling() {
    this.isAuthed = false;
    clearInterval(this.pollTimer);
    this.subject.next([]);
  }

  refresh() {
    this.http.get<any[]>(this.base, { withCredentials: true }).subscribe({
      next: (data) => {
        const mapped: INotification[] = data.map(n => ({
          id:      n.id.toString(),
          type:    n.type,
          icon:    n.icon,
          title:   n.title,
          message: n.message,
          time:    n.createdAt,
          read:    n.isRead,
          link:    n.link,
        }));
        this.subject.next(mapped);
      },
      error: () => { /* not logged in or offline — keep current */ }
    });
  }

  markRead(id: string) {
    this.subject.next(this.subject.value.map(n => n.id === id ? { ...n, read: true } : n));
    this.http.patch(`${this.base}/${id}/read`, {}, { withCredentials: true }).subscribe({ error: () => {} });
  }

  markAllRead() {
    this.subject.next(this.subject.value.map(n => ({ ...n, read: true })));
    this.http.patch(`${this.base}/read-all`, {}, { withCredentials: true }).subscribe({ error: () => {} });
  }

  /** Optional local-only toast-style notification (kept for backward compat) */
  add(_n: Omit<INotification, 'id' | 'time' | 'read'>) {
    // Server-driven now — refresh to pull the freshly created server notification
    this.refresh();
  }

  clear() {
    this.markAllRead();
  }
}
