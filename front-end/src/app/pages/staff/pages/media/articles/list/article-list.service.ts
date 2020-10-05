import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { IPagination } from '../../../../../../shared/components/pagination/pagination.model';
import { ArticleClass } from '../../../../../../shared/classes/media/article.class';
import { Observable } from 'rxjs';
import { HttpService } from '../../../../../../core/http/http.service';
import { map } from 'rxjs/operators';

@Injectable()
export class ArticleListService implements Resolve<IPagination<ArticleClass>> {

    constructor (private httpService: HttpService) {
    }

    resolve (route: ActivatedRouteSnapshot): Observable<IPagination<ArticleClass>> {
        return this.getPage(route.params.page, route.queryParams);
    }

    getPage (page: number, params?: { [key: string]: string }): Observable<IPagination<ArticleClass>> {
        return this.httpService.get(`/staff/articles/page/${page}`, { params: params })
            .pipe(map((data: IPagination<ArticleClass>) => {
                data.items = data.items.map(item => new ArticleClass(item));
                return data;
            }));
    }
}
