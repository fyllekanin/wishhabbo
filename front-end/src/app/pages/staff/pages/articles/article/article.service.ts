import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { ArticleClass } from '../../../../../shared/classes/media/article.class';
import { Observable } from 'rxjs';
import { HttpService } from '../../../../../core/http/http.service';
import { map } from 'rxjs/operators';
import { SiteNotificationService } from '../../../../../core/common-services/site-notification.service';
import { SiteNotificationType } from '../../../../../shared/app-views/site-notification/site-notification.interface';

@Injectable()
export class ArticleService implements Resolve<ArticleClass> {

    constructor (
        private httpService: HttpService,
        private siteNotificationService: SiteNotificationService
    ) {
    }

    resolve (route: ActivatedRouteSnapshot): Observable<ArticleClass> {
        return this.httpService.get(`/staff/article/${route.params.articleId}`)
            .pipe(map((data: ArticleClass) => new ArticleClass(data)));
    }

    save (article: ArticleClass, fileElement: HTMLInputElement): Promise<number | unknown> {
        const data = new FormData();
        data.append('article', JSON.stringify(article));
        data.append('thumbnail', fileElement.files[0]);
        if (article.articleId) {
            return this.httpService.post(`/staff/article/${article.articleId}`, data).toPromise()
                .then(articleId => {
                    this.siteNotificationService.create({
                        title: 'Updated',
                        message: 'Article updated',
                        type: SiteNotificationType.INFO
                    });
                    return articleId;
                })
                .catch(error => {
                    this.siteNotificationService.onError(error.error);
                });
        } else {
            return this.httpService.post('/staff/article', data).toPromise()
                .then(articleId => {
                    this.siteNotificationService.create({
                        title: 'Created',
                        message: 'Article created',
                        type: SiteNotificationType.INFO
                    });
                    return articleId;
                })
                .catch(error => {
                    this.siteNotificationService.onError(error.error);
                });
        }
    }
}
