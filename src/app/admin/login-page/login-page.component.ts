import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { User } from 'src/app/shared/interfaces';
import { AuthService } from '../shared/services/auth.service';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  form: any;
  submitted = false;
  message!: string;

  constructor(
    private fb: FormBuilder,
    public auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
    ) {
    this.form = this.fb.group({
      email: [ null, [
        Validators.required,
        Validators.email
        ]
      ],
      password: [ null, [
        Validators.required,
        Validators.minLength(6)
        ]
      ]
    })


  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      if(params['loginAgain']){
        this.message = 'Please, enter your details';
      } else if (params['authFailed']) {
        this.message = 'The session has expired. Enter data again.';
      }
    })
  }


  submit() {
    if (this.form.invalid) {
      return;
    }

    this.submitted = true;

    const user: User = {
      email: this.form.value.email,
      password: this.form.value.password
    }

    this.auth.login(user).subscribe(() => {
      this.form.reset();
      this.router.navigate(['/admin', 'dashboard']);
      this.submitted = false;
    },
    () => {
      this.submitted = false;
    })

  }

}
