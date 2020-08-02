import { Injectable } from '@angular/core';
import { AuthUser } from './auth-user.model';
import { Observable, throwError } from 'rxjs';
import { HttpService } from '../http/http.service';
import { catchError, map } from 'rxjs/operators';
import { LocalStorageKeys } from '../../shared/constants/local-storage.constants';

@Injectable()
export class AuthService {
    private authUser: AuthUser;

    constructor (private httpService: HttpService) {
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
                    this.authUser = new AuthUser(user);
                    this.updateStoredAuthUser(this.authUser);
                    res(true);
                }, () => {
                    res(false);
                });
        });
    }

    logout (): void {
        // Do logout
    }

    getAccessToken (): string {
        return this.isLoggedIn() ? this.authUser.accessToken : null;
    }

    getRefreshToken (): string {
        return this.isLoggedIn() ? this.authUser.refreshToken : null;
    }

    private updateStoredAuthUser (authUser: AuthUser): void {
        localStorage.setItem(LocalStorageKeys.AUTH_USER, JSON.stringify(authUser));
    }

    private getStoredAuthUser (): AuthUser {
        const json = localStorage.getItem(LocalStorageKeys.AUTH_USER);
        try {
            return JSON.parse(json);
        } catch (e) {
            return null;
        }
    }
}
