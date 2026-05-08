import { Component } from '@angular/core';
import { SharedModules } from '../../shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Api } from '../../services/api';
import { Router } from '@angular/router';
import { Ui } from '../../services/ui';
import { Data } from '../../services/data';

@Component({
  selector: 'app-login',
  imports: [...SharedModules],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  public loginForm: FormGroup;
  public signupForm: FormGroup;
  public showPassword: boolean = false;
  public showPassword2: boolean = false;
  public showRegisterForm: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private apiService: Api,
    private router: Router,
    private uiService: Ui,
    private dataService: Data,
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this.signupForm = this.formBuilder.group({
      name: ['', Validators.required],
      phone: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirm_password: ['', [Validators.required]],
    });
  }

  onShowPassword() {
    this.showPassword = !this.showPassword;
  }
  onShowPassword2() {
    this.showPassword2 = !this.showPassword2;
  }
  onShowRegisterForm() {
    this.showRegisterForm = !this.showRegisterForm;
    this.loginForm.setValue({
      email: '',
      password: '',
    });
    this.signupForm.setValue({
      name: '',
      phone: '',
      email: '',
      password: '',
      confirm_password: '',
    });
  }

  async onSubmit() {
    let submitData = this.loginForm.value;
    try {
      if (this.showRegisterForm) {
        submitData = this.signupForm.value;
        if (submitData.password != submitData.confirm_password) {
          this.uiService.openSnackBar('password and confirm password are not matched', 'OK');
          return;
        }
        const response: any = await this.apiService.httpPost('/auth/register', submitData);
        if (response.success) {
          this.uiService.openSnackBar('Registration successfull', 'OK');
          this.onShowRegisterForm();
        }
      } else {
        const response: any = await this.apiService.httpPost('/auth/login', submitData);
        if (response.success) {
          let token = response.token;
          let user = response.user;
          //save token function
          this.dataService.saveStorage('TOKEN', token);
          this.dataService.saveStorage('USER', user);
          this.router.navigateByUrl('/reports');
        } else {
          this.uiService.openSnackBar('Invalid email or password', 'OK');
        }
      }
    } catch (err: any) {
      this.uiService.openSnackBar('An error occurred: ' + err.message, 'OK');
    }
  }
}
