import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { defaultRoutes } from './default.routes';
import { ArticleModule } from '../../shared/components/article/article.module';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './not-found/not-found.component';
import { DefaultComponent } from './default.component';
import { ContentModule } from '../../shared/components/content/content.module';
import { StaffListComponent } from './staff-list/staff-list.component';
import { StaffListResolver } from './staff-list/staff-list.resolver';
import { HomeResolver } from './home/home.resolver';
import { HabboBadgeModule } from '../../shared/components/habbo-badge/habbo-badge.module';

@NgModule({
    imports: [
        RouterModule.forChild(defaultRoutes),
        ArticleModule,
        CommonModule,
        ContentModule,
        HabboBadgeModule
    ],
    declarations: [
        HomeComponent,
        NotFoundComponent,
        DefaultComponent,
        StaffListComponent
    ],
    providers: [
        StaffListResolver,
        HomeResolver
    ],
    exports: [
        RouterModule
    ]
})
export class DefaultModule {
}
