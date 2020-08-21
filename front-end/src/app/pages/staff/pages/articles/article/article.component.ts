import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UnSub } from '../../../../../shared/decorators/unsub.decorator';
import { Unsubscribable } from 'rxjs';
import { ARTICLE_DIFFICULTIES, ARTICLE_TYPES, ArticleClass } from '../../../../../shared/classes/media/article.class';
import { EditorComponent } from '../../../../../shared/components/editor/editor.component';
import { UserAction } from '../../../../../shared/constants/common.interfaces';
import { ArticleService } from './article.service';

@Component({
    selector: 'app-staff-articles-article',
    templateUrl: 'article.component.html',
    styleUrls: [ 'article.component.css' ]
})
@UnSub()
export class ArticleComponent implements AfterViewInit, OnDestroy {
    private readonly ACTIONS = {
        SAVE: 'save',
        DELETE: 'delete',
        BACK: 'back'
    };
    actions: Array<UserAction> = [];
    data: ArticleClass;
    subscriptions: Array<Unsubscribable> = [];

    types: Array<{ label: string, value: number, isBadgeMandatory: boolean }> = [];
    difficulties: Array<{ label: string, value: number }> = [];
    badges: string = '';
    @ViewChild(EditorComponent, { static: true }) editorComponent: EditorComponent;
    @ViewChild('fileElement', { static: true }) fileElementRef: ElementRef<HTMLInputElement>;

    constructor (
        private service: ArticleService,
        private router: Router,
        activatedRoute: ActivatedRoute
    ) {
        this.subscriptions.push(activatedRoute.data.subscribe(this.onData.bind(this)));
        this.types = Object.keys(ARTICLE_TYPES).map(key => {
            const type = ARTICLE_TYPES[key];
            return { label: type.name, value: Number(key), isBadgeMandatory: type.isBadgeMandatory };
        });
        this.difficulties = Object.keys(ARTICLE_DIFFICULTIES).map(key => {
            const difficulty = ARTICLE_DIFFICULTIES[key];
            return { label: difficulty.name, value: Number(key) };
        });
    }

    onBadgesChange (): void {
        this.data.badges = this.badges.split(',')
            .map(badge => badge.trim())
            .filter(badge => Boolean(badge));
    }

    ngOnDestroy (): void {
        // Empty
    }

    async onAction (action: UserAction): Promise<void> {
        switch (action.value) {
            case this.ACTIONS.BACK:
                this.router.navigateByUrl('/staff/articles/page/1');
                break;
            case this.ACTIONS.SAVE:
                const articleId = await this.service.save(this.data, this.fileElementRef.nativeElement);
                this.data.articleId = articleId as number;
                this.actions = this.getActions();
            case this.ACTIONS.DELETE:
                break;
        }
    }

    ngAfterViewInit (): void {
        this.editorComponent.setContent(this.data.content);
    }

    private onData ({ data }: { data: ArticleClass }): void {
        this.data = data;
        this.badges = this.data.badges.join(',');
        this.actions = this.getActions();
    }

    private getActions (): Array<UserAction> {
        return [
            { label: 'Save', value: this.ACTIONS.SAVE, isAvailable: true },
            { label: 'Delete', value: this.ACTIONS.DELETE, isAvailable: Boolean(this.data.articleId) },
            { label: 'Go back', value: this.ACTIONS.BACK, isAvailable: true }
        ].filter(action => action.isAvailable).map(action => {
            delete action.isAvailable;
            return action;
        });
    }
}
