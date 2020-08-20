import { Component, OnDestroy } from '@angular/core';
import { TableActionResponse, TableHeader, TableRow } from '../../../../../shared/components/table/table.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UnSub } from '../../../../../shared/decorators/unsub.decorator';
import { Unsubscribable } from 'rxjs';
import { IPagination, IPaginationResolver } from '../../../../../shared/components/pagination/pagination.model';
import { ArticleClass } from '../../../../../shared/classes/media/article.class';

@Component({
    selector: 'app-staff-articles-article-list',
    templateUrl: 'article-list.component.html'
})
@UnSub()
export class ArticleListComponent implements OnDestroy {
    private readonly ACTIONS = {
        EDIT: 'edit'
    };

    contentActions = [ { label: 'Create new', value: 'createNew' } ];
    data: IPagination<ArticleClass>;
    subscriptions: Array<Unsubscribable> = [];

    rows: Array<TableRow> = [];
    headers: Array<TableHeader> = [
        { label: 'Title' },
        { label: 'Type' },
        { label: 'Author' },
        { label: 'Is Approved' }
    ];

    constructor (
        private route: Router,
        activatedRoute: ActivatedRoute
    ) {
        this.subscriptions.push(activatedRoute.data.subscribe(this.onData.bind(this)));
    }

    onAction (response: TableActionResponse): void {
        switch (response.action.value) {
            case this.ACTIONS.EDIT:
                this.route.navigateByUrl(`/staff/articles/${response.row.rowId}`);
                break;
        }
    }

    onCreateNew (): void {
        this.route.navigateByUrl(`/staff/articles/new`);
    }

    ngOnDestroy (): void {
        // Empty
    }

    private onData ({ pagination }: IPaginationResolver<ArticleClass>): void {
        this.data = pagination;
        this.rows = this.data.items.map(item => ({
            rowId: item.articleId,
            isClickable: true,
            actions: [
                {
                    label: 'Edit',
                    value: this.ACTIONS.EDIT
                }
            ],
            cells: [
                { label: item.title },
                { label: item.getType().name },
                { label: item.user.username },
                { label: item.isApproved ? 'Yes' : 'No' }
            ]
        }));
    }
}
