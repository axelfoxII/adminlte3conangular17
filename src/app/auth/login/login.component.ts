import { Component } from '@angular/core';
import { Usuarios } from '../../interfaces/usuarios.interface';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  usuario='';
  pass = '';

  usuarios!:Usuarios;

  constructor(private usuariosSvc:AuthService){}

  onSubmit(){

  this.usuariosSvc.obtenerUsuarios(this.usuario,this.pass).subscribe((res:any)=>{

    if (res && res.length > 0) {

      const usuario = res[0];

      this.usuarios ={

        username:usuario.username,
        password:usuario.password

      }
      
      localStorage.setItem('usuario','true');
      localStorage.setItem('nombre',this.usuarios.username);

      location.href='dashboard';

      
    }else{

      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "El usuario no existe...",
        showConfirmButton: false,
        timer: 1500
      });

    }
    

  })

  }

}
