import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { defaultRoutes } from './default.routes';
import { SlimArticleModule } from '../../shared/components/slim-article/slim-article.module';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './not-found/not-found.component';
import { DefaultComponent } from './default.component';
import { ContentModule } from '../../shared/components/content/content.module';
import { StaffListComponent } from './staff-list/staff-list.component';
import { StaffListResolver } from './staff-list/staff-list.resolver';
import { HomeResolver } from './home/home.resolver';
import { HabboBadgeModule } from '../../shared/components/habbo-badge/habbo-badge.module';
import { ArticleService } from './article/article.service';
import { ArticleComponent } from './article/article.component';
import { NgxTwitterTimelineModule } from 'ngx-twitter-timeline';
import { TimetableModule } from '../../shared/components/timetable/timetable.module';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';

@NgModule({
    imports: [
        RouterModule.forChild(defaultRoutes),
        SlimArticleModule,
        CommonModule,
        ContentModule,
        HabboBadgeModule,
        NgxTwitterTimelineModule,
        TimetableModule
    ],
    declarations: [
        HomeComponent,
        NotFoundComponent,
        DefaultComponent,
        StaffListComponent,
        ArticleComponent,
        NotAuthorizedComponent
    ],
    providers: [
        StaffListResolver,
        HomeResolver,
        ArticleService
    ],
    exports: [
        RouterModule
    ]
})
export class DefaultModule {
}
