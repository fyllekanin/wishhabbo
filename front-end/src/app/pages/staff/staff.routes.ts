import { Routes } from '@angular/router';
import { StaffComponent } from './staff.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardResolver } from './dashboard/dashboard.resolver';

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
            }
        ]
    }
];
