import { Component } from '@angular/core';
import { ISideMenu } from '../../shared/components/side-menu/side-menu.interface';
import { AuthService } from '../../core/auth/auth.service';

@Component({
    selector: 'app-staff',
    templateUrl: 'staff.component.html',
    styleUrls: [ 'staff.component.css' ]
})
export class StaffComponent {
    menus: Array<ISideMenu> = [];

    constructor (authService: AuthService) {
        const user = authService.getAuthUser();
        this.menus = [
            {
                title: 'General',
                items: [
                    {
                        label: 'Dashboard',
                        url: '/staff',
                        icon: 'fas fa-home',
                        isApplicable: true
                    }
                ]
            },
            {
                title: 'Radio',
                items: [
                    {
                        label: 'Timetable',
                        url: '/staff/radio/timetable',
                        icon: 'fas fa-table',
                        isApplicable: user.staffPermissions.canBookRadio
                    }
                ]
            },
            {
                title: 'Events',
                items: [
                    {
                        label: 'Timetable',
                        url: '/staff/events/timetable',
                        icon: 'fas fa-table',
                        isApplicable: user.staffPermissions.canBookEvents
                    }
                ]
            },
            {
                title: 'Media',
                items: [
                    {
                        label: 'Articles',
                        url: '/staff/media/articles/page/1',
                        icon: 'fas fa-hashtag',
                        isApplicable: user.staffPermissions.canWriteArticles || user.staffPermissions.canApproveArticles
                    }
                ]
            }
        ];
    }
}
