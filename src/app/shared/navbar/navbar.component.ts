import { Component, OnInit, inject, /* Input */ } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MenubarModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
  
  /* @Input('items') items: MenuItem[] | undefined; */
  items: MenuItem[] | undefined;

  private loginService = inject(LoginService);
  
  ngOnInit() {
    this.items = [
      /* {
        label: 'EE.CC',
        icon: 'pi pi-chart-line',
      }, */
      {
        label: 'Salir',
        icon: 'pi pi-fw pi-power-off',
        command: () => {
          this.loginService.logout();
        }
      }
    ];
  }

}
