import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import firebase from 'firebase/app'
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient,HttpHeaders, HttpClientModule, HttpRequest, HttpEvent, HttpParams } from '@angular/common/http';
import { tap, map, catchError } from 'rxjs/operators';

export interface LoginUser {
  success: Success;
}
export interface Success {
  token: string;
  data:  Data;
}
export interface Data {
  id:                 number;
  username:           string;
  email:              string;
  S_Nombre:           string;
  S_Apellidos:        string;
  S_FotoPerfilURLSC:    string;
  S_Activo:           number;
  verification_token: string;
  verified:           string;
  tw_roleSC_id:         number;
  created_at:         Date;
  updated_at:         Date;
  deleted_at:         null;
  tw_roleSC:            TwRole;
}
export interface TwRole {
  id:         number;
  S_Nombre:   string;
  S_Activo:   number;
  N_Nivel:    number;
  created_at: Date;
  updated_at: Date;
  deleted_at: null;
}

@Injectable()
export class AuthService {
  private user: Observable<firebase.User>;
  private userDetails: firebase.User = null;
  // public apiURL = environment.apiURL;
  public apiURL = environment.apiURL;

  // public auth_token = 'Bearer '+localStorage.getItem('tokenscloud'); 

  constructor(public _firebaseAuth: AngularFireAuth, public router: Router, private _http:HttpClient) {
    this.user = _firebaseAuth.authState;
    this.user.subscribe( (user) => {
        if (user) {
          this.userDetails = user;
        }
        else {
          this.userDetails = null;
        }
      }
    );
  }
  signupUser(email: string, password: string) {
    //your code for signing up the new user
  }

  signinUser(email: string, password: string) : Observable<any> {

    // let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'Authorization': ` ${this.auth_token}`});
    let headers = new HttpHeaders({'Content-Type': 'application/json'});
    let options = { headers: headers };
    let data = { email:email,password: password };
    
    return this._http.post<LoginUser>(this.apiURL+'/login',data,options).pipe(map(success => success.success))    

  }

  logout() {
    this._firebaseAuth.signOut();
    this.router.navigate(['YOUR_LOGOUT_URL']);
  }

  isAuthenticated() {
    return true;
  }
}
