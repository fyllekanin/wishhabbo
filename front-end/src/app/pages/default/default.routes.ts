import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const defaultRoutes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: HomeComponent
    }
];
