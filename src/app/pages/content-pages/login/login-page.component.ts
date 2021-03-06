import { Component, ViewChild } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from 'app/shared/auth/auth.service';
import { NgxSpinnerService } from "ngx-spinner";
import swal from 'sweetalert2';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})

export class LoginPageComponent {

  loginFormSubmitted = false;
  isLoginFailed = false;

  loginForm = new FormGroup({
    username: new FormControl('guest@apex.com', [Validators.required]),
    password: new FormControl('Password', [Validators.required]),
    rememberMe: new FormControl(true)
  });


  constructor(private router: Router, private authService: AuthService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute) {
  }

  get lf() {
    return this.loginForm.controls;
  }

  // On submit button click
  onSubmit() {
    this.loginFormSubmitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    this.spinner.show(undefined,
      {
        type: 'ball-triangle-path',
        size: 'medium',
        bdColor: 'rgba(0, 0, 0, 0.8)',
        color: '#fff',
        fullScreen: true
      });

    this.authService.signinUser(this.loginForm.value.username, this.loginForm.value.password).subscribe(
        success => {
          localStorage.setItem("UserDataSC", JSON.stringify(success.data));
          localStorage.setItem("tokenscloud", success.token);
          swal.fire({
            icon: 'success',
            title: '¡Bienvenido!',
            text: 'En un momento serás redirigido',
            showConfirmButton: false,
            timer: 4000,
            customClass: {
              confirmButton: 'btn btn-primary'
            },
            buttonsStyling: false,
          });
          setTimeout(() => {
            
            this.router.navigate(['/page']);

            this.spinner.hide();
          }, 3000);
      },    
      (error) => {
        this.spinner.hide();
        swal.fire({
          title: "¡Error!",
          text: "Revisa tus datos de acceso",
          icon: "error",
          customClass: {
            confirmButton: 'btn btn-primary'
          },
          buttonsStyling: false,
        });
      });
  }

}
