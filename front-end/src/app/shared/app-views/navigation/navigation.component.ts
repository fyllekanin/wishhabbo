import { Component, HostBinding } from '@angular/core';
import { NavigationItem } from './navigation.model';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: [ './navigation.component.css' ]
})
export class NavigationComponent {
    data = {
        isLoggedIn: false,
        avatar: './assets/images/avatar.png',
        username: null
    };
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

    constructor (private authService: AuthService) {
        this.syncUser();
        authService.onAuthChange.subscribe(() => {
            this.syncUser();
        });
    }

    onLogout (): void {
        this.authService.logout();
    }

    private syncUser (): void {
        this.data.isLoggedIn = this.authService.isLoggedIn();
        this.data.avatar = this.authService.isLoggedIn() ? this.getAvatarUrl(this.authService.getAuthUser().habbo) : './assets/images/avatar.png';
        this.data.username = this.authService.isLoggedIn() ? this.authService.getAuthUser().username : null;
    }

    private getAvatarUrl (habbo: string): string {
        return `https://www.habbo.com/habbo-imaging/avatarimage?user=${habbo}&gesture=nrm&direction=4&head_direction=2&size=m`;
    }
}
