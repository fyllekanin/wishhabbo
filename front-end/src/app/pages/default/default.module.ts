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
import { ArticlesComponent } from './articles/articles.component';
import { ArticlesService } from './articles/articles.service';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from '../../shared/components/pagination/pagination.module';
import { SlideShowModule } from '../../shared/components/slide-show/slide-show.module';

@NgModule({
    imports: [
        RouterModule.forChild(defaultRoutes),
        SlimArticleModule,
        CommonModule,
        ContentModule,
        HabboBadgeModule,
        NgxTwitterTimelineModule,
        TimetableModule,
        FormsModule,
        PaginationModule,
        SlideShowModule
    ],
    declarations: [
        HomeComponent,
        NotFoundComponent,
        DefaultComponent,
        StaffListComponent,
        ArticleComponent,
        NotAuthorizedComponent,
        ArticlesComponent
    ],
    providers: [
        StaffListResolver,
        HomeResolver,
        ArticleService,
        ArticlesService
    ],
    exports: [
        RouterModule
    ]
})
export class DefaultModule {
}
