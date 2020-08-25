import { Component } from '@angular/core';
import { Article } from '../../../shared/components/article/article.model';

@Component({
    selector: 'app-default-home',
    templateUrl: 'home.component.html',
    styleUrls: [ 'home.component.css' ]
})
export class HomeComponent {
    articles: Array<Article> = [
        new Article({
            articleId: 1,
            title: 'Build-A-Wand',
            author: 'erico',
            badge: null
        }),
        new Article({
            articleId: 2,
            title: 'Build a taxy',
            author: 'phil',
            badge: null
        }),
        new Article({
            articleId: 3,
            title: 'Build a upside down house',
            author: 'jenna',
            badge: null
        })
    ];
    ngAfterViewInit(): void {
        (<any>window).twttr.widgets.load();
    }    
}
