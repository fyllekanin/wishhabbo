import { Component } from '@angular/core';
import { Unsubscribable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { UserGroupsModel } from './user-groups.model';

@Component({
    selector: 'app-admin-users-users-groups',
    templateUrl: 'user-groups.component.html'
})
export class UserGroupsComponent {
    data = new UserGroupsModel();
    subscriptions: Array<Unsubscribable> = [];

    constructor (
        activatedRoute: ActivatedRoute
    ) {
        this.subscriptions
            .push(activatedRoute.data.subscribe(({ data }: { data: UserGroupsModel }) => this.data = data));
    }
}
