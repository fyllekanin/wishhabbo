import { Router } from '@angular/router';
import { Component, HostBinding, HostListener, Input } from '@angular/core';
import { ArticleClass } from '../../classes/media/article.class';

@Component({
    selector: 'app-slim-article',
    templateUrl: 'slim-article.component.html',
    styleUrls: [ 'slim-article.component.css' ]
})
export class SlimArticleComponent {
    @HostBinding('class.gray-bottom-shadow') lightDarkBottomShadow = true;
    @Input() article: ArticleClass;

    constructor(private router: Router) {}

    @HostListener('click', ['$event.target'])
    onClick(): void {
        this.router.navigateByUrl(`/default/article/${this.article.articleId}`);
    }
}

