import { Component, OnDestroy } from '@angular/core';
import { TableHeader, TableRow } from '../../../../../shared/components/table/table.model';
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

    onRowClick (row: TableRow): void {
        this.route.navigateByUrl(`/staff/articles/${row.rowId}`);
    }

    ngOnDestroy (): void {
        // Empty
    }

    private onData ({ pagination }: IPaginationResolver<ArticleClass>): void {
        this.data = pagination;
        this.rows = this.data.items.map(item => ({
            rowId: item.articleId,
            isClickable: true,
            actions: [],
            cells: [
                { label: item.title },
                { label: item.getType().name },
                { label: item.user.username },
                { label: item.isApproved ? 'Yes' : 'No' }
            ]
        }));
    }
}
