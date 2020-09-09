import { NgModule } from '@angular/core';
import { TableModule } from '../../../../shared/components/table/table.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ContentModule } from '../../../../shared/components/content/content.module';
import { CommonModule } from '@angular/common';
import { WebsiteSettingsComponent } from './website-settings.component';
import { WebsiteSettingsListComponent } from './list/website-settings-list.component';
import { websiteSettingsRoutes } from './website-settings.routes';
import { StaffListService } from './staff-list/staff-list.service';
import { StaffListComponent } from './staff-list/staff-list.component';

@NgModule({
    imports: [
        RouterModule.forChild(websiteSettingsRoutes),
        ContentModule,
        CommonModule,
        TableModule,
        FormsModule
    ],
    declarations: [
        WebsiteSettingsComponent,
        WebsiteSettingsListComponent,
        StaffListComponent
    ],
    providers: [
        StaffListService
    ],
    exports: [
        RouterModule
    ]
})
export class WebsiteSettingsModule {
}

