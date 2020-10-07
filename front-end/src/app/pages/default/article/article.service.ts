import { HttpService } from './../../../core/http/http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { ArticlePage } from './article.model';
import { SiteNotificationService } from '../../../core/common-services/site-notification.service';
import { SiteNotificationType } from '../../../shared/app-views/site-notification/site-notification.interface';

@Injectable()
export class ArticleService implements Resolve<ArticlePage> {

    constructor (
        private siteNotificationService: SiteNotificationService,
        private httpService: HttpService
    ) {
    }

    resolve (activatedRouteSnapshot: ActivatedRouteSnapshot): Observable<ArticlePage> {
        return this.httpService.get(`/page/article/${activatedRouteSnapshot.params.articleId}`)
            .pipe(map(data => new ArticlePage(data)));
    }

    markAsComplete (articleId: number): Promise<void> {
        return this.httpService.post(`/page/article/${articleId}/complete`, null).toPromise()
            .then(() => {
                this.siteNotificationService.create({
                    title: 'Success',
                    message: 'You have marked the involved badges complete!',
                    type: SiteNotificationType.INFO
                });
            })
            .catch(error => this.siteNotificationService.onError(error.error));
    }
}
