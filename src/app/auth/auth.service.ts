import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuarios } from '../interfaces/usuarios.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private URL = 'http://localhost:3000';

  constructor(private http:HttpClient) { }

  obtenerUsuarios(user:string,password:string):Observable<Usuarios>{

   // http://localhost:3000/users?username=usuario1&password=contraseña1

  return this.http.get<Usuarios>(`${this.URL}/users?usermane=${user}&password=${password}`);

  }

}
