import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableHeader, TableRow } from './table.model';

@Component({
    selector: 'app-table',
    templateUrl: 'table.component.html',
    styleUrls: [ 'table.component.css' ]
})
export class TableComponent {
    private myRows: Array<TableRow> = [];


    @Input() headers: Array<TableHeader> = [];
    @Output() onRowClick: EventEmitter<TableRow> = new EventEmitter<TableRow>();
    doAnyRowHaveActions = false;

    @Input()
    set rows (rows: Array<TableRow>) {
        this.myRows = rows;
        this.doAnyRowHaveActions = this.myRows.some(row => Array.isArray(row.actions));
    }

    get rows (): Array<TableRow> {
        return this.myRows;
    }
}
