import { Component, HostBinding, Input } from '@angular/core';

@Component({
    selector: 'app-content',
    templateUrl: 'content.component.html',
    styleUrls: [ 'content.component.css' ]
})
export class ContentComponent {
    @HostBinding('class.gray-bottom-shadow') grayBottomShadow = true;
    @Input() title: string;
}
