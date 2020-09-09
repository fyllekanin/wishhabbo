import { Routes } from '@angular/router';
import { WebsiteSettingsComponent } from './website-settings.component';
import { WebsiteSettingsListComponent } from './list/website-settings-list.component';
import { StaffListComponent } from './staff-list/staff-list.component';
import { StaffListService } from './staff-list/staff-list.service';

export const websiteSettingsRoutes: Routes = [
    {
        path: '',
        component: WebsiteSettingsComponent,
        children: [
            {
                path: 'list',
                component: WebsiteSettingsListComponent
            },
            {
                path: 'staff-list',
                component: StaffListComponent,
                resolve: {
                    data: StaffListService
                }
            }
        ]
    }
];
