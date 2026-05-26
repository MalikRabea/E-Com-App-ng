import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IdentityService } from '../identity.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreService } from '../../core/core.service';

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

  constructor(
    private fb: FormBuilder,
    private _service: IdentityService,
    private route: Router,
    private router: ActivatedRoute,
    private coreService: CoreService
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
        next: (value) => {
          this.coreService.getUserName().subscribe();
          console.log(value);
          this.route.navigateByUrl(this.retrunUrl);
        },
        error(err) {
          console.log(err);
        },
      });
    }
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
