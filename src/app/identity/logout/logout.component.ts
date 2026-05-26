import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IdentityService } from '../identity.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent {
  constructor(private identityService: IdentityService, private router: Router) {}

  logout() {
    this.identityService.Logout().subscribe({
      next: () => {
        // نجاح تسجيل الخروج
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error("Logout failed", err);
      }
    });
  }
}
