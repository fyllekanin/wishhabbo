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
import { TableModule } from '../../shared/components/table/table.module';
import { ArticleListService } from './pages/articles/list/article-list.service';
import { ArticleService } from './pages/articles/article/article.service';
import { FormsModule } from '@angular/forms';
import { EditorModule } from '../../shared/components/editor/editor.module';

@NgModule({
    imports: [
        RouterModule.forChild(staffRoutes),
        ContentModule,
        SideMenuModule,
        CommonModule,
        TableModule,
        FormsModule,
        EditorModule
    ],
    declarations: [
        StaffComponent,
        DashboardComponent,
        ArticleComponent,
        ArticleListComponent
    ],
    providers: [
        DashboardResolver,
        ArticleListService,
        ArticleService
    ],
    exports: [
        RouterModule
    ]
})
export class StaffModule {
}
