import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UnSub } from '../../../../../shared/decorators/unsub.decorator';
import { Unsubscribable } from 'rxjs';
import { ARTICLE_TYPES, ArticleClass } from '../../../../../shared/classes/media/article.class';

@Component({
    selector: 'app-staff-articles-article',
    templateUrl: 'article.component.html',
    styleUrls: [ 'article.component.css' ]
})
@UnSub()
export class ArticleComponent implements OnDestroy {
    data: ArticleClass;
    subscriptions: Array<Unsubscribable> = [];

    types: Array<{ label: string, value: number, isBadgeMandatory: boolean }> = [];
    badges: Array<string> = [];

    constructor (activatedRoute: ActivatedRoute) {
        this.subscriptions.push(activatedRoute.data.subscribe(this.onData.bind(this)));
        this.types = Object.keys(ARTICLE_TYPES).map(key => {
            const type = ARTICLE_TYPES[key];
            return { label: type.name, value: Number(key), isBadgeMandatory: type.isBadgeMandatory };
        });
    }

    onBadgesChange (): void {
        this.badges = this.data.badges.split(',')
            .map(badge => badge.trim())
            .filter(badge => Boolean(badge));
    }

    ngOnDestroy (): void {
        // Empty
    }

    private onData ({ data }: { data: ArticleClass }): void {
        this.data = data;
    }
}
