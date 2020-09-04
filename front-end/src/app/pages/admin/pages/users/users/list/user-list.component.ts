import { Component, OnDestroy } from '@angular/core';
import { TableActionResponse, TableHeader, TableRow } from '../../../../../../shared/components/table/table.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UnSub } from '../../../../../../shared/decorators/unsub.decorator';
import { Unsubscribable } from 'rxjs';
import { IPagination, IPaginationResolver } from '../../../../../../shared/components/pagination/pagination.model';
import { DialogService } from '../../../../../../core/common-services/dialog.service';
import { TimeHelper } from '../../../../../../shared/helpers/time.helper';
import { AuthService } from '../../../../../../core/auth/auth.service';
import { SlimUser } from '../../../../../../shared/classes/slim-user.class';

@Component({
    selector: 'app-admin-users-users-list',
    templateUrl: 'user-list.component.html'
})
@UnSub()
export class UserListComponent implements OnDestroy {
    private readonly ACTIONS = {
        EDIT_BASIC: 'edit_basic'
    };

    data: IPagination<SlimUser>;
    subscriptions: Array<Unsubscribable> = [];

    rows: Array<TableRow> = [];
    headers: Array<TableHeader> = [
        { label: 'Username' },
        { label: 'Habbo' },
        { label: 'Last Modified' }
    ];

    constructor (
        private route: Router,
        private dialogService: DialogService,
        private authService: AuthService,
        activatedRoute: ActivatedRoute
    ) {
        this.subscriptions.push(activatedRoute.data.subscribe(this.onData.bind(this)));
    }

    onAction (response: TableActionResponse): void {
        switch (response.action.value) {
            case this.ACTIONS.EDIT_BASIC:
                this.route.navigateByUrl(`/admin/users/users/${response.row.rowId}`);
                break;
        }
    }

    onCreateNew (): void {
        this.route.navigateByUrl(`/admin/users/users/new`);
    }

    ngOnDestroy (): void {
        // Empty
    }

    private onData ({ pagination }: IPaginationResolver<SlimUser>): void {
        this.data = pagination;
        this.rows = this.getRows();
    }

    private getRows (): Array<TableRow> {
        return this.data.items.map(item => ({
            rowId: item.userId,
            actions: [
                {
                    label: 'Edit basic',
                    value: this.ACTIONS.EDIT_BASIC,
                    isHidden: !this.authService.getAuthUser().adminPermissions.CAN_MANAGE_USER_BASICS
                }
            ],
            cells: [
                { label: item.username },
                { label: item.habbo },
                { label: TimeHelper.getLongDateWithTime(item.updatedAt) }
            ]
        }));
    }
}
