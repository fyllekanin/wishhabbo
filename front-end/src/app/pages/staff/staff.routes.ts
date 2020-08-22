import { Routes } from '@angular/router';
import { StaffComponent } from './staff.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DashboardResolver } from './pages/dashboard/dashboard.resolver';

export const staffRoutes: Routes = [
    {
        path: '',
        component: StaffComponent,
        children: [
            {
                path: '',
                component: DashboardComponent,
                resolve: {
                    data: DashboardResolver
                }
            },
            {
                path: 'media',
                loadChildren: () => import('./pages/media/media.module').then(m => m.MediaModule)
            },
            {
                path: 'radio',
                loadChildren: () => import('./pages/radio/radio.module').then(m => m.RadioModule)
            }
        ]
    }
];
