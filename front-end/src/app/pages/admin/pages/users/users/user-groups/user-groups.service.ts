import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpService } from '../../../../../../core/http/http.service';
import { map } from 'rxjs/operators';
import { UserGroupsModel } from './user-groups.model';

@Injectable()
export class UserGroupsService implements Resolve<UserGroupsModel> {

    constructor (private httpService: HttpService) {
    }

    resolve (route: ActivatedRouteSnapshot): Observable<UserGroupsModel> {
        return this.httpService.get(`/admin/users/users/${route.params.userId}/groups`)
            .pipe(map((data: UserGroupsModel) => new UserGroupsModel(data)));
    }
}
