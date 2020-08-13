import { Routes } from '@angular/router';
import { StaffComponent } from './staff.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DashboardResolver } from './pages/dashboard/dashboard.resolver';
import { ArticleListComponent } from './pages/articles/list/article-list.component';
import { ArticleComponent } from './pages/articles/article/article.component';

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
                component: ArticleListComponent
            },
            {
                path: 'articles/:id',
                component: ArticleComponent
            }
        ]
    }
];
