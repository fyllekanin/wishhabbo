import { CombineSubscriptions, UnSub } from '../../../shared/decorators/unsub.decorator';
import { ActivatedRoute } from '@angular/router';
import { Component, OnDestroy } from '@angular/core';
import { ArticleClass } from '../../../shared/classes/media/article.class';
import { Unsubscribable } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'app-default-article',
    templateUrl: 'article.component.html',
    styleUrls: ['article.component.css']
})
@UnSub()
export class ArticleComponent implements OnDestroy {
    data = new ArticleClass(null);

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

    private onData ({data}: { data: ArticleClass }): void {
        this.data = data;
        this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(this.data.parsedContent);
    }
}
