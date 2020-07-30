import { Component, HostBinding } from '@angular/core';
import { NavigationItem } from './navigation.model';

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: [ './navigation.component.css' ]
})
export class NavigationComponent {
    items: Array<NavigationItem> = [
        new NavigationItem({
            title: 'WishHabbo',
            icon: 'fa-home'
        }),
        new NavigationItem({
            title: 'Radio',
            icon: 'fa-headphones'
        }),
        new NavigationItem({
            title: 'Events',
            icon: 'fa-gamepad'
        })
    ];


    @HostBinding('class.dark-bottom-shadow') lightDarkBottomShadow = true;

}
