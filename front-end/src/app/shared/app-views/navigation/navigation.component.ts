import { Component, HostBinding } from '@angular/core';
import { NavigationItem } from './navigation.model';
import { AuthService } from '../../../core/auth/auth.service';
import { AuthUser } from '../../../core/auth/auth-user.model';

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {
    user: AuthUser;
    avatarUrl: string;
    items: Array<NavigationItem> = [
        new NavigationItem({
            title: 'WishHabbo',
            path: '/default',
            icon: 'fa-home'
        }),
        new NavigationItem({
            title: 'Staff list',
            path: '/default/staff-list'
        }),
        new NavigationItem({
            title: 'Radio',
            icon: 'fa-headphones',
            path: `/default/timetable/radio/${new Date().getDay() === 0 ? 7 : new Date().getDay()}`
        }),
        new NavigationItem({
            title: 'Events',
            icon: 'fa-gamepad',
            path: `/default/timetable/events/${new Date().getDay() === 0 ? 7 : new Date().getDay()}`
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
        this.user = this.authService.getAuthUser();
        this.avatarUrl = this.authService.isLoggedIn() ? this.getAvatarUrl(this.user.habbo) : './assets/images/avatar.png';
    }

    private getAvatarUrl (habbo: string): string {
        return `https://www.habbo.com/habbo-imaging/avatarimage?user=${habbo}&gesture=nrm&direction=4&head_direction=2&size=m`;
    }
}
