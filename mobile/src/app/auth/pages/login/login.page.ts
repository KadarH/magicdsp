import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials: FormGroup;
  registerForm: FormGroup;
  mode = 'login';
  userType = '1';

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.registerForm = this.fb.group({
      status_id: ['1', [Validators.required]],
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required]],
      address: ['', [Validators.required]],
      phone_number: ['', [Validators.required]],
      vat_number: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  register() {
    console.log(this.registerForm.value);
    this.authService.register(this.registerForm.value).subscribe((res) => {
      this.router.navigateByUrl('quotes/add');
    });
  }

  login() {
    this.authService.login(this.credentials.value).subscribe((res) => {
      if (this.authService.getUser().admin) {
        this.router.navigateByUrl('home');
      } else {
        this.router.navigateByUrl('quotes/list');
      }
    });
  }

  // Easy access for form fields
  get email() {
    return this.credentials.get('email');
  }

  get password() {
    return this.credentials.get('password');
  }
  segmentChanged(event: any) {}
}
