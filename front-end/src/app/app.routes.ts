import { Routes } from '@angular/router';

export const appRoutes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        loadChildren: () => import('./pages/default/default.module').then(m => m.DefaultModule)
    }
];
