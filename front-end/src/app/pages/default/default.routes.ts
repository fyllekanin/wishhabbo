import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { DefaultComponent } from './default.component';
import { StaffListResolver } from './staff-list/staff-list.resolver';
import { StaffListComponent } from './staff-list/staff-list.component';

export const defaultRoutes: Routes = [
    {
        path: '',
        component: DefaultComponent,
        children: [
            {
                path: '',
                component: HomeComponent
            },
            {
                path: 'not-found',
                component: NotFoundComponent
            },
            {
                path: 'staff-list',
                component: StaffListComponent,
                resolve: {
                    data: StaffListResolver
                }
            }
        ]
    }
];
