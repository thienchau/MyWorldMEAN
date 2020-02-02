import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/service/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../core/service/user.service';
import { TranslateService } from '@ngx-translate/core';

 declare var $: any;

@Component({
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {

  isSubmitting = false;
  authForm: FormGroup;
  registerForm: FormGroup;
  loginFail: boolean;
  errorMessage: string;


  constructor(
    private authService: AuthService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    public translate: TranslateService
  ) {

    // use FormBuilder to create a form group
    this.authForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dob: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      zipCode: ['', Validators.required],
      gender: ['male'],
    });
  }

  isFieldInValid(field: string) {
    return !this.authForm.get(field).valid && this.authForm.get(field).touched;
  }

  isFieldInValidRegister(field: string) {
    return !this.registerForm.get(field).valid && this.registerForm.get(field).touched;
  }

  ngOnInit() {
    // login & register form
    $('button.signup').on('click', function () {
      $('.login-reg-bg').addClass('show');
      return false;
    });

    $('.already-have').on('click', function () {
      $('.login-reg-bg').removeClass('show');
      return false;
    });
  }

  login() {
    if (this.authForm.valid) {
      this.isSubmitting = true;
      const payload = this.authForm.value;
      this.authService
        .login(payload)
        .subscribe(
          data => {
            this.router.navigateByUrl('/');
          },
          err => {
            this.loginFail = true;
            this.isSubmitting = false;
          }
        );
    } else {
      this.validateAllFormFields(this.authForm);
    }
  }

  register() {
    if (this.registerForm.valid) {
      this.isSubmitting = true;
      const payload = this.registerForm.value;
      this.userService
        .register(payload)
        .subscribe(
          data => {
            this.isSubmitting = false;
            $('.login-reg-bg').removeClass('show');
          },
          err => {
            this.errorMessage = err.message;
            this.isSubmitting = false;
          }
        );
    } else {
      this.validateAllFormFields(this.registerForm);
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }
}
