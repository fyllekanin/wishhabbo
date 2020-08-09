import { Component, Input } from '@angular/core';
import { ISideMenu } from './side-menu.interface';

@Component({
    selector: 'app-side-menu',
    templateUrl: 'side-menu.component.html',
    styleUrls: [ 'side-menu.component.css' ]
})
export class SideMenuComponent {
    @Input() menu: ISideMenu;
}
