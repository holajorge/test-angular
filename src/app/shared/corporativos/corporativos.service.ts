import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import firebase from 'firebase/app'
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient,HttpHeaders, HttpClientModule, HttpRequest, HttpEvent, HttpParams } from '@angular/common/http';
import { tap, map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CorporativosService {

  public auth_token = 'Bearer '+localStorage.getItem('tokenscloud'); 
  public apiURL = environment.apiURL;


  constructor(private _http:HttpClient) { 

  }
  listaCorporativos(){
    
    let headers = new HttpHeaders({'Authorization': ` ${this.auth_token}`});    
    let options = { headers: headers };
    
    return this._http.get(this.apiURL+"/corporativos",options).toPromise().then((res) =>{      
      return { success: true, response:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }
  getDetalleCorporativoID(corporativoID){

    let headers = new HttpHeaders({'Authorization': ` ${this.auth_token}`});    
    let options = { headers: headers };
    
    return this._http.get(this.apiURL+"/corporativos/"+corporativoID,options).toPromise().then((res) =>{      
      return { success: true, response:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }
  editarContacto(id,contacto){
    let headers = new HttpHeaders({'Authorization': ` ${this.auth_token}`});    
    let options = { headers: headers };
    
    return this._http.put(this.apiURL+"/contactos/"+id,contacto,options).toPromise().then((res) =>{      
      return { success: true, response:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }
  newContacto(contacto){
    let headers = new HttpHeaders({'Authorization': ` ${this.auth_token}`});    
    let options = { headers: headers };
    
    return this._http.post(this.apiURL+"/contactos",contacto,options).toPromise().then((res) =>{      
      return { success: true, response:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }

  deleteContact(id){
    let headers = new HttpHeaders({'Authorization': ` ${this.auth_token}`});    
    let options = { headers: headers };
    
    return this._http.delete(this.apiURL+"/contactos/"+id,options).toPromise().then((res) =>{      
      return { success: true, response:res};
    })
    .catch( (err) =>{
      return { success: false, msj:'Ocurrió un error en al traer los datos'};
    });
  }

}
