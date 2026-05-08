import { Component } from '@angular/core';
import { SharedModules } from '../../shared/shared.module';
import { FormGroup } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Api } from '../../services/api';
import { Ui } from '../../services/ui';
import { Data } from '../../services/data';

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
    private apiService: Api,
    private formBuilder: FormBuilder,
    private router: Router,
    private uiService: Ui,
    private dataService: Data,
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
    });
  }

  onShowPassword() {
    this.showPassword = !this.showPassword;
  }

  async onSubmit() {
    const loginData = this.loginForm.value;
    try {
      const response: any = await this.apiService.httpPost('/auth/login', loginData);
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
    } catch (err: any) {
      this.uiService.openSnackBar('An error occured:' + err.message, 'OK');
    }
  }
}
