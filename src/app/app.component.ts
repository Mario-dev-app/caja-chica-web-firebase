import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'frontend';

  private loginService = inject(LoginService);
  
  ngOnInit() {
    if(localStorage.getItem('usuario')) {
      this.loginService.isLogged = true;
      this.loginService.usuario = JSON.parse(localStorage.getItem('usuario') || '');
    }
  }
}
