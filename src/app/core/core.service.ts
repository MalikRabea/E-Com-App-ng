import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CoreService {
  constructor(private http: HttpClient) {}

  baseURL = environment.baseURL;

  private name = new BehaviorSubject<string>('');
  userName$ = this.name.asObservable();

  // 🔹 Logout الآن POST ويخلي الـ BehaviorSubject فاضي
  logout() {
    return this.http.post(this.baseURL + 'Account/Logout', {}, { withCredentials: true }).pipe(
      map(() => {
        this.name.next(''); // يمسح اسم المستخدم
      })
    );
  }

  getUserName() {
    return this.http.get(this.baseURL + 'Account/get-user-name', { withCredentials: true }).pipe(
      map((value: any) => {
        this.name.next(value.message); // يحدّث اسم المستخدم
      })
    );
  }
}
