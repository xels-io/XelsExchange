import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import {  UserService } from '../shared/service/user.service';
import { debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  errorMessage: boolean;
  erM: any;
  submitted = false;
  loginFormErrors = {
    'email': '',
    'password': '',
  };
  sendValidationMessages = {
    'email': {
      'required': 'An email address is required.',
      'pattern': 'Use a valid email',
    },
    'password': {
      'required': 'Password is required.'
    }
  };
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,) {

    }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['' , Validators.compose([Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]

    });
    this.loginForm.valueChanges.pipe(debounceTime(300))
  .subscribe(data => this.onSendValueChanged(data));

  }
  onSendValueChanged(data?: any) {
    if (!this.loginForm) { return; }
    const form = this.loginForm;
  // tslint:disable-next-line: forinn
    for (const field in this.loginFormErrors) {
      this.loginFormErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.sendValidationMessages[field];
        // tslint:disable-next-line:forin
        for (const key in control.errors) {
          this.loginFormErrors[field] += messages[key] + ' ';
        }
      }
    }

  }

  onLogin(e) {
    e.preventDefault();
     this.submitted = true;
    console.log(this.loginForm);
    // stop here if form is invalid
    if (this.loginForm.status === "INVALID") {
        return;
    }
    this.loading = true;
    this.userService.loginUser(this.loginForm.value)
        .pipe(first())
        .subscribe(
            data => {
              console.log(data);
              if (data.status === true) {
                this.router.navigate(['/']);
              }
              else {
                this.errorMessage = true ;
                this.erM = data.message ;
              }
                // this.alertService.success('Registration successful', true);
            },
            error => {
                //this.alertService.error(error);
                this.loading = false;
            });
      }
}
