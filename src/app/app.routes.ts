import { Routes } from '@angular/router';

// Services
import { AuthGuardService } from './auth/auth-guard.service';

import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { dashboardRoutes } from './dashboard/dashboard.routes';

export const AppRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    {
        path: '',
        component: DashboardComponent,
        children: dashboardRoutes,
        canActivate: [
            AuthGuardService
        ]
    },
    { path: '**', redirectTo: '' }
];