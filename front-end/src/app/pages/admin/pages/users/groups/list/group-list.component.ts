import { Component, OnDestroy } from '@angular/core';
import { TableActionResponse, TableHeader, TableRow } from '../../../../../../shared/components/table/table.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UnSub } from '../../../../../../shared/decorators/unsub.decorator';
import { Unsubscribable } from 'rxjs';
import { IPagination, IPaginationResolver } from '../../../../../../shared/components/pagination/pagination.model';
import { DialogService } from '../../../../../../core/common-services/dialog.service';
import { GroupClass } from '../../../../../../shared/classes/admin/group.class';
import { TimeHelper } from '../../../../../../shared/helpers/time.helper';
import { GroupService } from '../group/group.service';

@Component({
    selector: 'app-admin-users-group-list',
    templateUrl: 'group-list.component.html'
})
@UnSub()
export class GroupListComponent implements OnDestroy {
    private readonly ACTIONS = {
        EDIT: 'edit',
        DELETE: 'delete'
    };

    contentActions = [ { label: 'Create new', value: 'createNew' } ];
    data: IPagination<GroupClass>;
    subscriptions: Array<Unsubscribable> = [];

    rows: Array<TableRow> = [];
    headers: Array<TableHeader> = [
        { label: 'Name' },
        { label: 'Immunity' },
        { label: 'Last Modified' }
    ];

    constructor (
        private groupService: GroupService,
        private route: Router,
        private dialogService: DialogService,
        activatedRoute: ActivatedRoute
    ) {
        this.subscriptions.push(activatedRoute.data.subscribe(this.onData.bind(this)));
    }

    onAction (response: TableActionResponse): void {
        switch (response.action.value) {
            case this.ACTIONS.EDIT:
                this.route.navigateByUrl(`/admin/users/groups/${response.row.rowId}`);
                break;
            case this.ACTIONS.DELETE:
                this.onDelete(response.row.rowId as number);
                break;
        }
    }

    onCreateNew (): void {
        this.route.navigateByUrl(`/admin/users/groups/new`);
    }

    ngOnDestroy (): void {
        // Empty
    }

    private async onDelete (groupId: number): Promise<void> {
        const confirmed = await this.dialogService.confirm('Do you really wanna delete this group?');
        if (confirmed) {
            await this.groupService.delete(groupId);
            this.rows = this.rows.filter(row => row.rowId !== groupId);
        }
    }

    private onData ({ pagination }: IPaginationResolver<GroupClass>): void {
        this.data = pagination;
        this.rows = this.getRows();
    }

    private getRows (): Array<TableRow> {
        return this.data.items.map(item => ({
            rowId: item.groupId,
            actions: [
                {
                    label: 'Edit',
                    value: this.ACTIONS.EDIT
                },
                {
                    label: 'Delete',
                    value: this.ACTIONS.DELETE
                }
            ],
            cells: [
                { label: item.name },
                { label: item.immunity },
                { label: TimeHelper.getLongDateWithTime(item.createdAt) }
            ]
        }));
    }
}
