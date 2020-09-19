import { Component, OnDestroy } from '@angular/core';
import { TableActionResponse, TableHeader, TableRow } from '../../../../../../shared/components/table/table.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UnSub } from '../../../../../../shared/decorators/unsub.decorator';
import { Unsubscribable } from 'rxjs';
import { BbcodeClass } from '../../../../../../shared/classes/bbcode.class';
import { TimeHelper } from '../../../../../../shared/helpers/time.helper';
import { UserAction } from '../../../../../../shared/constants/common.interfaces';

@Component({
    selector: 'app-admin-website-settings-bbcode-list',
    templateUrl: 'bbcode-list.component.html'
})
@UnSub()
export class BbcodeListComponent implements OnDestroy {
    private readonly ACTIONS = {
        EDIT: 'edit',
        DELETE: 'delete'
    };
    headers: Array<TableHeader> = [
        {label: 'Name'},
        {label: 'Example'},
        {label: 'Last modified'}
    ];
    contentActions: Array<UserAction> = [{label: 'Create', value: 'create'}];
    subscriptions: Array<Unsubscribable> = [];
    editableTableRows: Array<TableRow> = [];
    systemTableRows: Array<TableRow> = [];

    constructor (
        private router: Router,
        activatedRoute: ActivatedRoute
    ) {
        this.subscriptions.push(activatedRoute.data.subscribe(this.onData.bind(this)));
    }

    ngOnDestroy () {
        // Empty
    }

    onCreateNew (): void {
        this.router.navigateByUrl('/admin/website-settings/bbcodes/new');
    }

    async onAction (action: TableActionResponse): Promise<void> {
        // Empty
    }

    private onData ({data}: { data: Array<BbcodeClass> }): void {
        this.editableTableRows = this.getRows(data.filter(bbcode => !bbcode.isSystem), true);
        this.systemTableRows = this.getRows(data.filter(bbcode => bbcode.isSystem), false);
    }

    private getRows (bbcodes: Array<BbcodeClass>, doHaveActions: boolean): Array<TableRow> {
        return bbcodes.map(bbcode => ({
            rowId: bbcode.bbcodeId,
            cells: [
                {label: bbcode.name},
                {label: bbcode.example},
                {label: TimeHelper.getLongDateWithTime(bbcode.updatedAt)}
            ],
            actions: doHaveActions ? [
                {label: 'Edit', value: this.ACTIONS.EDIT},
                {label: 'Delete', value: this.ACTIONS.DELETE}
            ] : []
        }));
    }
}
