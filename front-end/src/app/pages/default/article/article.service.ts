import { HttpService } from './../../../core/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { ArticlePage } from './article.model';

@Injectable()
export class ArticleService implements Resolve<ArticlePage> {

    constructor (private httpService: HttpService) {
    }

    resolve (activatedRouteSnapshot: ActivatedRouteSnapshot): Observable<ArticlePage> {
        return this.httpService.get(`/page/article/${activatedRouteSnapshot.params.articleId}`)
            .pipe(map(data => new ArticlePage(data)));
    }

}
