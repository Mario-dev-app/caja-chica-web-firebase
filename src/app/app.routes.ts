import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { isLoggedGuard } from './services/guards/is-logged.guard';
import { isNotLoggedGuard } from './services/guards/is-not-logged.guard';
import { CashOutlayComponent } from './pages/cash-outlay/cash-outlay.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent, canActivate: [isLoggedGuard] },
    { path: 'pages', canActivate: [isNotLoggedGuard], children: [
        { path: 'home', component: HomeComponent },
        { path: 'cash-outlay', component: CashOutlayComponent }
    ]},
    { path: '**', pathMatch: 'full', redirectTo: 'login' }
];
