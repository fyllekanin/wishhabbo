import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { defaultRoutes } from './default.routes';
import { ArticleModule } from '../../shared/components/article/article.module';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        RouterModule.forChild(defaultRoutes),
        ArticleModule,
        CommonModule
    ],
    declarations: [
        HomeComponent
    ],
    exports: [
        RouterModule
    ]
})
export class DefaultModule {
}
