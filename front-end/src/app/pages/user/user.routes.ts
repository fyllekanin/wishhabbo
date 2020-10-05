import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UserComponent } from './user.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';

export const userRoutes: Routes = [
    {
        path: '',
        component: UserComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                component: DashboardComponent
            },
            {
                path: 'change-password',
                component: ChangePasswordComponent
            }
        ]
    }
];
