import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { UserAction } from '../../constants/common.interfaces';

@Component({
    selector: 'app-content',
    templateUrl: 'content.component.html',
    styleUrls: [ 'content.component.css' ]
})
export class ContentComponent {
    @HostBinding('class.gray-bottom-shadow') grayBottomShadow = true;
    @Input() header: string;
    @Input() titleBackground = '#9a7993';
    @Input() actions: Array<UserAction> = [];

    @Output() onAction: EventEmitter<UserAction> = new EventEmitter();
}
