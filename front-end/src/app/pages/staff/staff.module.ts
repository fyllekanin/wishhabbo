import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { staffRoutes } from './staff.routes';
import { StaffComponent } from './staff.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ContentModule } from '../../shared/components/content/content.module';
import { SideMenuModule } from '../../shared/components/side-menu/side-menu.module';
import { CommonModule } from '@angular/common';
import { DashboardResolver } from './pages/dashboard/dashboard.resolver';
import { ArticleComponent } from './pages/articles/article/article.component';
import { ArticleListComponent } from './pages/articles/list/article-list.component';

@NgModule({
    imports: [
        RouterModule.forChild(staffRoutes),
        ContentModule,
        SideMenuModule,
        CommonModule
    ],
    declarations: [
        StaffComponent,
        DashboardComponent,
        ArticleComponent,
        ArticleListComponent
    ],
    providers: [
        DashboardResolver
    ],
    exports: [
        RouterModule
    ]
})
export class StaffModule {
}
