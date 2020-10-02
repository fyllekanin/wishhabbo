import { CombineSubscriptions, UnSub } from '../../../shared/decorators/unsub.decorator';
import { ActivatedRoute } from '@angular/router';
import { Component, OnDestroy } from '@angular/core';
import { Unsubscribable } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ArticlePage } from './article.model';

@Component({
    selector: 'app-default-article',
    templateUrl: 'article.component.html',
    styleUrls: ['article.component.css']
})
@UnSub()
export class ArticleComponent implements OnDestroy {
    data = new ArticlePage(null);

    @CombineSubscriptions()
    subscriber: Unsubscribable;
    sanitizedContent: SafeHtml;

    constructor (
        private sanitizer: DomSanitizer,
        activatedRoute: ActivatedRoute
    ) {
        this.subscriber = activatedRoute.data.subscribe(this.onData.bind(this));
    }

    ngOnDestroy (): void {
        // Empty
    }

    private onData ({ data }: { data: ArticlePage }): void {
        this.data = data;
        this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(this.data.article.parsedContent);
    }
}
