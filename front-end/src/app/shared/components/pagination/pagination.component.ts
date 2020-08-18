import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-pagination',
    templateUrl: 'pagination.component.html',
    styleUrls: [ 'pagination.component.css' ]
})
export class PaginationComponent {
    @Input() total: number;
    @Input() page: number;
    @Output() onPage: EventEmitter<number> = new EventEmitter<number>();

}
