import { NgModule } from '@angular/core';
import { AdminComponent } from './admin.component';
import { SideMenuModule } from '../../shared/components/side-menu/side-menu.module';
import { CommonModule } from '@angular/common';
import { ContentModule } from '../../shared/components/content/content.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { adminRoutes } from './admin.routes';

@NgModule({
    imports: [
        RouterModule.forChild(adminRoutes),
        CommonModule,
        SideMenuModule,
        ContentModule
    ],
    declarations: [
        AdminComponent,
        DashboardComponent
    ],
    providers: [],
    exports: [
        RouterModule
    ]
})
export class AdminModule {
}
