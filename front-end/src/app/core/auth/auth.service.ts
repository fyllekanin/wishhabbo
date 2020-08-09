import { Injectable } from '@angular/core';
import { AuthUser } from './auth-user.model';
import { Observable, Subject, throwError } from 'rxjs';
import { HttpService } from '../http/http.service';
import { catchError, map } from 'rxjs/operators';
import { LocalStorageKeys } from '../../shared/constants/local-storage.constants';
import { SiteNotificationService } from '../common-services/site-notification.service';
import { SiteNotificationType } from '../../shared/app-views/site-notification/site-notification.interface';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {
    private authUser: AuthUser;
    private onAuthChangeSubject: Subject<void> = new Subject<void>();
    onAuthChange = this.onAuthChangeSubject.asObservable();

    constructor (
        private httpService: HttpService,
        private siteNotificationService: SiteNotificationService,
        private router: Router) {
        this.authUser = this.getStoredAuthUser();
    }

    isLoggedIn (): boolean {
        return Boolean(this.authUser);
    }

    refreshToken (): Observable<string> {
        return this.httpService.post('/auth/token-refresh', null, {
            headers: {
                'RefreshAuthorization': this.getRefreshToken()
            }
        }).pipe(map((res: AuthUser) => {
            this.authUser = new AuthUser(res);
            this.updateStoredAuthUser(this.authUser);
            return this.getAccessToken();
        }), catchError(error => {
            this.authUser = null;
            this.updateStoredAuthUser(null);
            return throwError(error);
        }));
    }

    doLogin (username: string, password: string): Promise<boolean> {
        return new Promise(res => {
            this.httpService.post('/auth/login', { username: username, password: password })
                .subscribe(user => {
                    this.setAuthUser(<AuthUser>user);
                    this.siteNotificationService.create({
                        title: 'Success',
                        message: 'You are logged in!',
                        type: SiteNotificationType.SUCCESS
                    });
                    res(true);
                }, () => {
                    res(false);
                });
        });
    }

    logout (): void {
        this.httpService.post('/auth/logout', null)
            .subscribe(() => {
                this.authUser = null;
                this.updateStoredAuthUser(this.authUser);
                this.siteNotificationService.create({
                    title: 'Success',
                    message: 'You have logged out',
                    type: SiteNotificationType.SUCCESS
                });
                this.onAuthChangeSubject.next();
                this.router.navigateByUrl('/auth/login');
            });
    }

    getAccessToken (): string {
        return this.isLoggedIn() ? this.authUser.accessToken : null;
    }

    getRefreshToken (): string {
        return this.isLoggedIn() ? this.authUser.refreshToken : null;
    }

    getAuthUser (): AuthUser {
        return this.authUser;
    }

    setAuthUser (authUser: AuthUser): void {
        this.authUser = authUser ? new AuthUser(authUser) : null;
        this.updateStoredAuthUser(this.authUser);
        this.onAuthChangeSubject.next();
    }

    private updateStoredAuthUser (authUser: AuthUser): void {
        localStorage.setItem(LocalStorageKeys.AUTH_USER, JSON.stringify(authUser));
    }

    private getStoredAuthUser (): AuthUser {
        const json = localStorage.getItem(LocalStorageKeys.AUTH_USER);
        try {
            const parsed = JSON.parse(json);
            return parsed ? new AuthUser(JSON.parse(json)) : null;
        } catch (e) {
            return null;
        }
    }
}
