import { Component, HostBinding, Input } from '@angular/core';
import { Article } from './article.model';

@Component({
    selector: 'app-article',
    templateUrl: 'article.component.html',
    styleUrls: [ 'article.component.css' ]
})
export class ArticleComponent {
    @HostBinding('class.gray-bottom-shadow') lightDarkBottomShadow = true;
    @Input() article: Article;

}

