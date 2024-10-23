import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  isLogged: boolean = false;

  usuario: any;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  login(usuario: string, password: string) {
    return this.http.post(`${environment.base_url}/login-wp`, {usuario, password});
  }

  logout() {
    localStorage.removeItem('usuario');
    this.isLogged = false;
    this.router.navigateByUrl('/login');
  }
}
