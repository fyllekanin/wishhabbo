import { Routes } from '@angular/router';
import { UsersComponent } from './users.component';
import { GroupListComponent } from './groups/list/group-list.component';
import { GroupListService } from './groups/list/group-list.service';
import { GroupComponent } from './groups/group/group.component';
import { GroupService } from './groups/group/group.service';
import { UserListComponent } from './users/list/user-list.component';
import { UserListService } from './users/list/user-list.service';

export const usersRoutes: Routes = [
    {
        path: '',
        component: UsersComponent,
        children: [
            {
                path: 'groups/page/:page',
                component: GroupListComponent,
                resolve: {
                    pagination: GroupListService
                }
            },
            {
                path: 'groups/:groupId',
                component: GroupComponent,
                resolve: {
                    data: GroupService
                }
            },
            {
                path: 'users/page/:page',
                component: UserListComponent,
                resolve: {
                    pagination: UserListService
                }
            }
        ]
    }
];
