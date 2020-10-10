import { CombineSubscriptions, UnSub } from '../../../shared/decorators/unsub.decorator';
import { ActivatedRoute } from '@angular/router';
import { Component, OnDestroy } from '@angular/core';
import { Unsubscribable } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ArticlePage } from './article.model';
import { ArticleService } from './article.service';
import { AuthService } from '../../../core/auth/auth.service';

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
    isLoggedIn: boolean;

    constructor (
        private service: ArticleService,
        private sanitizer: DomSanitizer,
        authService: AuthService,
        activatedRoute: ActivatedRoute
    ) {
        this.isLoggedIn = authService.isLoggedIn();
        this.subscriber = activatedRoute.data.subscribe(this.onData.bind(this));
    }

    ngOnDestroy (): void {
        // Empty
    }

    async markComplete (): Promise<void> {
        await this.service.markAsComplete(this.data.article.articleId);
        this.data.isCompleted = true;
    }

    private onData ({ data }: { data: ArticlePage }): void {
        this.data = data;
        this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(this.data.article.parsedContent);
    }
}
