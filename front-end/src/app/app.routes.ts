import { Routes } from '@angular/router';

export const appRoutes: Routes = [
    {
        path: 'default',
        loadChildren: () => import('./pages/default/default.module').then(m => m.DefaultModule)
    },
    {
        path: 'auth',
        loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule)
    },
    {
        path: 'staff',
        loadChildren: () => import('./pages/staff/staff.module').then(m => m.StaffModule)
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'default'
    }
];
