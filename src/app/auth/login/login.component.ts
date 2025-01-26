import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { UsuarioModel } from '../../models/usuario.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  user: string = '';
  usuario=new UsuarioModel();
  pass: string = '';
  passwordFieldType: string = 'password';
  usuarios!: UsuarioModel;
  rememberMe:boolean = false;

  constructor(private authSvc: AuthService) {}
  ngOnInit() {
    const savedEmail = localStorage.getItem('email');
    if (savedEmail) {
      this.user = savedEmail;
      this.usuario.email = savedEmail;  // Asignar solo el correo
      this.rememberMe = true;
    }
  }

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }
 

    login(forma:NgForm){

    
      this.usuario = {
        email: forma.value.email,
        password: forma.value.password
      }
      if (this.rememberMe) {
        localStorage.setItem('email', forma.value.email);
      } else {
        localStorage.removeItem('email');
      }
      this.authSvc.login(this.usuario);
  
    }
  
   
  

}
