import { UnSub } from '../../../shared/decorators/unsub.decorator';
import { ActivatedRoute } from '@angular/router';
import { Component, OnDestroy } from '@angular/core';
import { ArticleClass } from '../../../shared/classes/media/article.class';
import { Unsubscribable } from 'rxjs';

@Component({
    selector: 'app-default-article',
    templateUrl: 'article.component.html',
    styleUrls: ['article.component.css']
})
@UnSub()
export class ArticleComponent implements OnDestroy {
    data = new ArticleClass(null);

    subscriptions: Array<Unsubscribable> = [];

    constructor(
        activatedRoute: ActivatedRoute
    ) {
        this.subscriptions.push(activatedRoute.data.subscribe(this.onData.bind(this)));
    }

    ngOnDestroy(): void {
        // Empty
    }

    private onData({ data }: { data: ArticleClass }): void {
        this.data = data;
    }
}