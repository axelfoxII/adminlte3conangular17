import { Injectable } from '@angular/core';
import { environment } from '../../environments/enviroment.prod';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UsuarioModel } from '../models/usuario.model';
import * as bcrypt from 'bcryptjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.urlServer;

  constructor(private http:HttpClient, private router:Router) { }

  login(usuario:UsuarioModel){

    this.http.get<{[key:string]:UsuarioModel}>(`${this.apiUrl}/usuarios.json?orderBy="email"&equalTo="${usuario.email}"`).subscribe((res:{[key:string]:UsuarioModel})=>{

      const user = Object.values(res)[0];
      console.log(user)
      if(user){

        if(user.estado === false){

          Swal.fire('ERROR','El usuario esta inactivo en el sistema','error');
          return;

        }

        if (user.email === usuario.email) {
          
          const passwordToCompare = usuario.password ?? '';
          const storedPassword = user.password ?? '';
          const isMatch = bcrypt.compareSync(passwordToCompare,storedPassword);
          

          if (isMatch) {
            console.log('login exitoso');

            const usuarioTemp = {...user};
            delete usuarioTemp.password;

            localStorage.setItem('currentUser',JSON.stringify(usuarioTemp));
            location.href='/dashboard';

          }else{

            console.error("El password es incorrecto");  
            Swal.fire('ERROR', 'Revise su email ó contraseña que estén bien escritos', 'error'); 

          }


        }else{

          console.error("El email es incorrecto");
          Swal.fire('ERROR', 'Revise su email ó contraseña que estén bien escritos', 'error'); 

        }




      }else{
        console.error('Usuario no encontrado');
        Swal.fire('ERROR', 'Revise su email ó contraseña que estén bien escritos', 'error'); 
      }



    })


  }
}
