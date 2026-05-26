import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IdentityService } from '../identity.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  profile: { email: string; displayName: string } | null = null;
  displayName = '';
  loading = true;
  saving = false;

  constructor(
    private identityService: IdentityService,
    private toast: ToastrService
  ) {}

  ngOnInit() {
    this.identityService.getProfile().subscribe({
      next: (data) => {
        this.profile = data;
        this.displayName = data.displayName;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  save() {
    if (!this.displayName.trim()) return;
    this.saving = true;
    this.identityService.updateProfile(this.displayName).subscribe({
      next: () => {
        this.saving = false;
        if (this.profile) this.profile.displayName = this.displayName;
        this.toast.success('Profile updated!');
      },
      error: () => {
        this.saving = false;
        this.toast.error('Failed to update profile');
      }
    });
  }
}
