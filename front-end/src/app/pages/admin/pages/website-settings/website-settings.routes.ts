import { Routes } from '@angular/router';
import { WebsiteSettingsComponent } from './website-settings.component';
import { WebsiteSettingsListComponent } from './list/website-settings-list.component';
import { StaffListComponent } from './staff-list/staff-list.component';
import { StaffListService } from './staff-list/staff-list.service';
import { RadioSettingsComponent } from './radio-settings/radio-settings.component';
import { RadioSettingsService } from './radio-settings/radio-settings.service';

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
            },
            {
                path: 'radio-settings',
                component: RadioSettingsComponent,
                resolve: {
                    data: RadioSettingsService
                }
            }
        ]
    }
];
