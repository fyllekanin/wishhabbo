import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { IPagination } from '../../../../../../shared/components/pagination/pagination.model';
import { Observable } from 'rxjs';
import { HttpService } from '../../../../../../core/http/http.service';
import { map } from 'rxjs/operators';
import { GroupClass } from '../../../../../../shared/classes/admin/group.class';

@Injectable()
export class GroupListService implements Resolve<IPagination<GroupClass>> {

    constructor (private httpService: HttpService) {
    }

    resolve (route: ActivatedRouteSnapshot): Observable<IPagination<GroupClass>> {
        return this.getPage(route.params.page);
    }

    getPage (page: number): Observable<IPagination<GroupClass>> {
        return this.httpService.get(`/admin/groups/page/${page}`)
            .pipe(map((data: IPagination<GroupClass>) => {
                data.items = data.items.map(item => new GroupClass(item));
                return data;
            }));
    }
}
