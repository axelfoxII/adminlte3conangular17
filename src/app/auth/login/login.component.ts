import { Component } from '@angular/core';
import { UsuariosService } from '../usuarios.service';
import { Usuarios } from '../../interfaces/usuarios.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  usuario: string = '';
  pass: string = '';
  passwordFieldType: string = 'password';
  usuarios!: Usuarios;

  constructor(private usurioSvc: UsuariosService) {}

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  onSubmit() {
    this.usurioSvc.obtenerUsuario(this.usuario, this.pass).subscribe(
      (res: any) => {
        console.log(res);
        if (res && res.length > 0) {
          const usuario = res[0];
          this.usuarios = {
            username: usuario.username,
            password: usuario.password
          };
          localStorage.setItem('usuario', 'true');
          localStorage.setItem('nombre', this.usuarios.username);

          location.href = 'dashboard';
        } else {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "No se encontro ningun usuario",
            showConfirmButton: false,
            timer: 2500
          });

          this.usuario = '';
          this.pass = '';
        }
      }
    );
  }
 

}
