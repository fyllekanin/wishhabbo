import { Component, HostBinding } from '@angular/core';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: [ './header.component.css' ]
})
export class HeaderComponent {
    @HostBinding('class.dark-bottom-shadow') lightDarkBottomShadow = true;
}
