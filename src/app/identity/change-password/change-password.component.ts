import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IdentityService } from '../identity.service';

function passwordMatchValidator(): ValidatorFn {
  return (form: AbstractControl): ValidationErrors | null => {
    const np = form.get('newPassword')?.value;
    const cp = form.get('confirmPassword')?.value;
    if (np && cp && np !== cp) {
      form.get('confirmPassword')?.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
})
export class ChangePasswordComponent {
  form: FormGroup;
  loading = false;
  success = false;

  constructor(
    private fb: FormBuilder,
    private identityService: IdentityService,
    private toast: ToastrService,
    private router: Router
  ) {
    this.form = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required,
        Validators.pattern(/^(?=.*[0-9])(?=.*[#$@!.\-])[A-Za-z\d#$@!.\-]{8,}$/)]],
      confirmPassword: ['', Validators.required],
    }, { validators: passwordMatchValidator() });
  }

  get currentPassword() { return this.form.get('currentPassword'); }
  get newPassword() { return this.form.get('newPassword'); }
  get confirmPassword() { return this.form.get('confirmPassword'); }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    const { currentPassword, newPassword } = this.form.value;
    this.identityService.changePassword(currentPassword, newPassword).subscribe({
      next: () => {
        this.loading = false;
        this.success = true;
        this.toast.success('Password changed successfully');
        setTimeout(() => this.router.navigateByUrl('/'), 2000);
      },
      error: (err) => {
        this.loading = false;
        const msg = err?.error?.message || 'Failed to change password';
        this.toast.error(msg);
      }
    });
  }
}
