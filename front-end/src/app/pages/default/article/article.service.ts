import { ArticleClass } from './../../../shared/classes/media/article.class';
import { HttpService } from './../../../core/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class ArticleService implements Resolve<ArticleClass> {

    constructor (private httpService: HttpService) {
    }

    resolve (activatedRouteSnapshot: ActivatedRouteSnapshot): Observable<ArticleClass> {
        return this.httpService.get(`/page/article/${activatedRouteSnapshot.params.articleId}`)
            .pipe(map(data => new ArticleClass(data)));
    }

}
