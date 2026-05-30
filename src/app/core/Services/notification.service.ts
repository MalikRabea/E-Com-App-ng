import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

export interface INotification {
  id: string;
  type: 'order' | 'promo' | 'info' | 'success' | 'warning';
  icon: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  link?: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly KEY = 'app_notifications';
  private subject = new BehaviorSubject<INotification[]>(this.load());

  notifications$ = this.subject.asObservable();
  unreadCount$   = this.notifications$.pipe(map(n => n.filter(x => !x.read).length));

  add(n: Omit<INotification, 'id' | 'time' | 'read'>) {
    const item: INotification = {
      ...n,
      id:   Date.now().toString(),
      time: new Date().toISOString(),
      read: false,
    };
    const updated = [item, ...this.subject.value].slice(0, 30);
    this.save(updated);
  }

  markRead(id: string) {
    const updated = this.subject.value.map(n => n.id === id ? { ...n, read: true } : n);
    this.save(updated);
  }

  markAllRead() {
    const updated = this.subject.value.map(n => ({ ...n, read: true }));
    this.save(updated);
  }

  clear() {
    this.save([]);
  }

  private load(): INotification[] {
    try {
      const raw = localStorage.getItem(this.KEY);
      return raw ? JSON.parse(raw) : this.defaults();
    } catch {
      return this.defaults();
    }
  }

  private save(n: INotification[]) {
    localStorage.setItem(this.KEY, JSON.stringify(n));
    this.subject.next(n);
  }

  private defaults(): INotification[] {
    return [{
      id:      'welcome',
      type:    'info',
      icon:    'waving_hand',
      title:   'Welcome to E-Shop!',
      message: 'Discover our latest products and exclusive deals.',
      time:    new Date().toISOString(),
      read:    false,
      link:    '/shop',
    }];
  }
}
