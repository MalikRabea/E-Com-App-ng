import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IdentityService } from '../identity.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreService } from '../../core/core.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { SupportService } from '../../core/Services/support.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'], // صححت typo styleUrl -> styleUrls
})
export class LoginComponent implements OnInit, AfterViewInit {
  formGroup: FormGroup;
  emailModel = '';
  retrunUrl = '/';
  forgotOpen = false;
  showPass = false;

  // 2FA
  otpStep = false;
  otpCode = '';
  otpEmail = '';
  otpVerifying = false;

  constructor(
    private fb: FormBuilder,
    private _service: IdentityService,
    private route: Router,
    private router: ActivatedRoute,
    private coreService: CoreService,
    private http: HttpClient,
    private support: SupportService
  ) {}

  ngOnInit(): void {
    this.FormValidation();
    this.router.queryParams.subscribe((param) => {
      this.retrunUrl = param['returnUrl'] || '/';
    });
  }

  ngAfterViewInit(): void {
    const myModal = document.getElementById('exampleModal');
    const myInput = document.getElementById('myInput');

    if (myModal && myInput) {
      myModal.addEventListener('shown.bs.modal', () => {
        myInput.focus();
      });
    }
  }

  FormValidation() {
    this.formGroup = this.fb.group({
      email: ['MWRx99@gmail.com', [Validators.required, Validators.email]],
      password: [
        'MWRx99$$',
        [
          Validators.required,
          Validators.pattern(/^(?=.*[0-9])(?=.*[#$@!.\-])[A-Za-z\d#$@!.\-]{8,}$/),
        ],
      ],
    });
  }

  get _email() {
    return this.formGroup.get('email');
  }
  get _password() {
    return this.formGroup.get('password');
  }

  Submit() {
    if (this.formGroup.valid) {
      this._service.Login(this.formGroup.value).subscribe({
        next: () => {
          // Check if 2FA is enabled for this account
          this.support.twoFactorStatus().subscribe({
            next: (s) => {
              if (s?.enabled) {
                this.otpEmail = this.formGroup.value.email;
                this.support.sendOtp(this.otpEmail).subscribe();
                this.otpStep = true;
              } else {
                this.coreService.getUserName().subscribe();
                this.route.navigateByUrl(this.retrunUrl);
              }
            },
            error: () => {
              this.coreService.getUserName().subscribe();
              this.route.navigateByUrl(this.retrunUrl);
            }
          });
        },
        error: (err) => console.log(err),
      });
    }
  }

  verifyOtp() {
    if (this.otpCode.length < 6) return;
    this.otpVerifying = true;
    this.support.verifyOtp(this.otpEmail, this.otpCode).subscribe({
      next: () => {
        this.coreService.getUserName().subscribe();
        this.route.navigateByUrl(this.retrunUrl);
      },
      error: () => { this.otpVerifying = false; this.otpCode = ''; }
    });
  }

  resendOtp() {
    this.support.sendOtp(this.otpEmail).subscribe();
  }

  googleSignIn() {
    // Uses Google Identity Services (GIS) — requires the script in index.html
    const google = (window as any).google;
    if (!google?.accounts) {
      alert('Google Sign-In is not configured. Please add your Google Client ID to index.html.');
      return;
    }
    google.accounts.oauth2.initTokenClient({
      client_id: 'YOUR_GOOGLE_CLIENT_ID', // Replace with actual client ID
      scope: 'email profile openid',
      callback: (tokenResponse: any) => {
        if (tokenResponse.access_token) {
          this.http.post<any>(`${environment.baseURL}SocialAuth/google`,
            { accessToken: tokenResponse.access_token },
            { withCredentials: true }
          ).subscribe({
            next: () => {
              this.coreService.getUserName().subscribe();
              this.route.navigateByUrl(this.retrunUrl);
            },
            error: (err) => console.error('Google login failed', err)
          });
        }
      }
    }).requestAccessToken();
  }

  SendEmailForgetpassword() {
    this._service.forgetPassword(this.emailModel).subscribe({
      next(value) {
        console.log(value);
      },
      error(err) {
        console.log(err);
      },
    });
  }
}
