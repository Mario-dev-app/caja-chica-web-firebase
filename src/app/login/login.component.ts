import { Component, inject } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { CheckboxModule } from 'primeng/checkbox';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { MessagesService } from '../services/messages.service';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DividerModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    CheckboxModule,
    ProgressBarModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  isLoading: boolean = false;

  private loginService = inject(LoginService);
  private messagesService = inject(MessagesService);

  constructor(
    private router: Router
  ) {}

  showPass: boolean = false;

  loginForm = new FormGroup({
    usuario: new FormControl('finance', [Validators.required, Validators.minLength(3)]),
    password: new FormControl('123456', [Validators.required, Validators.minLength(3)])
  });

  login() {
    this.isLoading = true;
    if(!this.loginForm.valid) {
      this.messagesService.showWarning('Complete correctamente el formulario de inicio de sesión');
      this.isLoading = false;
      return;
    }
    
    const usuario = this.loginForm.controls['usuario'].value!.trim();
    const password = this.loginForm.controls['password'].value!.trim();
    
    this.loginService.login(usuario, password).subscribe((resp:any) => {
      localStorage.setItem('usuario', JSON.stringify(resp.usuario));
      this.loginService.usuario = resp.usuario;
      this.loginService.isLogged = true;
      this.isLoading = false;
      /* this.router.navigate(['pages', 'home'], {queryParams: { p : 0}}); */
      if(resp.usuario.role === 'ADMIN') {
        this.router.navigateByUrl('pages/home');
      }
      
      if(resp.usuario.role === 'FINZ') {
        this.router.navigateByUrl('pages/cash-outlay');
      }
    }, (err) => {
      this.isLoading = false;
      this.messagesService.showError(err.error.message);
    });
  }
}
