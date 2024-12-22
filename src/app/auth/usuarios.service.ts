import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuarios } from '../interfaces/usuarios.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  //http://localhost:3000/users?username=usuario2&password=contraseña2
  private URL = 'http://localhost:3000'
  constructor(private http:HttpClient) { }

  obtenerUsuario(user:string,password:string):Observable<Usuarios>{

      
    return this.http.get<Usuarios>(`${this.URL}/users?username=${user}&password=${password}`);

  }


  }
