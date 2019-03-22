import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import {  UserService } from '../shared/service/user.service';
import { debounceTime } from 'rxjs/operators';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  errorMessage: boolean;
  erM: any;
  submitted = false;
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  signFormErrors = {
    // 'firstName': '',
    // 'lastName: '',
    'email': '',
    'username': '',
    'password': '',
  };

  sendValidationMessages = {
    'email': {
      'required': 'An email address is required.',
      'pattern': 'Use a valid email',
    },
    'username': {
      'required': 'Username is required.'
    },
    'password': {
      'required': 'Password is required.'
    }
  };
  constructor( private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    ) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      // tslint:disable-next-line:max-line-length
      email: ['' , Validators.compose([Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
  });

  this.registerForm.valueChanges.pipe(debounceTime(300))
  .subscribe(data => this.onSendValueChanged(data));
  }

  onSendValueChanged(data?: any) {
    if (!this.registerForm) { return; }
    const form = this.registerForm;
  // tslint:disable-next-line: forinn
    for (const field in this.signFormErrors) {
      this.signFormErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.sendValidationMessages[field];
        // tslint:disable-next-line:forin
        for (const key in control.errors) {
          this.signFormErrors[field] += messages[key] + ' ';
        }
      }
    }

  }
  // convenience getter for easy access to form fields
  get f() {
    console.log("hello f");
    return this.registerForm.controls;
   }

  onSubmit(e) {
    e.preventDefault();
     this.submitted = true;
    console.log(this.registerForm);
    // stop here if form is invalid
    if (this.registerForm.status === "INVALID") {
        return;
    }
    this.loading = true;
    this.userService.registerUser(this.registerForm.value)
        .pipe(first())
        .subscribe(
            data => {
              console.log(data);
              if (data.status === true) {
                this.router.navigate(['/login']);
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
