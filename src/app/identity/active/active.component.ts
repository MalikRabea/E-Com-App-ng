import { AfterViewInit, Component } from '@angular/core';
import { ActiveAccount } from '../../shared/Models/ActiveAccount';
import { ActivatedRoute, Router } from '@angular/router';
import { IdentityService } from '../identity.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-active',
  templateUrl: './active.component.html',
  styleUrl: './active.component.scss',
})
export class ActiveComponent implements AfterViewInit {
  activeParam = new ActiveAccount();
  constructor(
    private router: ActivatedRoute,
    private _service: IdentityService,
    private _toast: ToastrService,
    private route:Router
  ) {}

  ngAfterViewInit(): void {
    this.router.queryParams.subscribe((param) => {
      this.activeParam.email = param['email'];
      this.activeParam.token = param['code'];
    });
    
    console.log(this.router);

    this._service.active(this.activeParam).subscribe({
      next: (value) => {
        console.log(value);
        this._toast.success('Your account is active', 'SUCCESS');
        this.route.navigateByUrl('/Account/Login')
        return
      },
      error: (err) => {
        console.log(err);
       
      },
    });
  }
}
