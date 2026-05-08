import { Component } from '@angular/core';
import { SharedModules } from '../../shared/shared.module';
import { Auth } from '../../services/auth';
import { FormGroup } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [...SharedModules],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginForm!: FormGroup;
  showPassword: boolean = false;

  constructor(
    //private authService: Auth,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
    });
  }

  onSubmit() {}

  onShowPassword() {
    this.showPassword = !this.showPassword;
  }
}
