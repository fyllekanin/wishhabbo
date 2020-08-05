import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SiteNotification } from '../../shared/app-views/site-notification/site-notification.interface';

@Injectable()
export class SiteNotificationService {
    private onSiteNotificationSubject: Subject<SiteNotification> = new Subject<SiteNotification>();
    onSiteNotification: Observable<SiteNotification> = this.onSiteNotificationSubject.asObservable();

    create (notification: SiteNotification): void {
        if (!notification) {
            return;
        }
        this.onSiteNotificationSubject.next(notification);
    }
}
