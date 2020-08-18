import { Routes } from '@angular/router';
import { StaffComponent } from './staff.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DashboardResolver } from './pages/dashboard/dashboard.resolver';
import { ArticleListComponent } from './pages/articles/list/article-list.component';
import { ArticleComponent } from './pages/articles/article/article.component';
import { ArticleListService } from './pages/articles/list/article-list.service';
import { ArticleService } from './pages/articles/article/article.service';

export const staffRoutes: Routes = [
    {
        path: '',
        component: StaffComponent,
        children: [
            {
                path: '',
                component: DashboardComponent,
                resolve: {
                    data: DashboardResolver
                }
            },
            {
                path: 'articles/page/:page',
                component: ArticleListComponent,
                resolve: {
                    pagination: ArticleListService
                }
            },
            {
                path: 'articles/:articleId',
                component: ArticleComponent,
                resolve: {
                    data: ArticleService
                }
            }
        ]
    }
];
