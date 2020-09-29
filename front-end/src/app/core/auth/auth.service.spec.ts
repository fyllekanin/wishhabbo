import { take, catchError } from 'rxjs/operators';
import { AuthUser } from './auth-user.model';
import { SiteNotificationService } from './../common-services/site-notification.service';
import { HttpService } from '../http/http.service';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Observable, of, pipe, throwError } from 'rxjs';

describe('AuthService', () => {

    let service: AuthService;
    let httpService: HttpService;
    let siteNotificationService: SiteNotificationService;

    beforeEach(() => {
        siteNotificationService = <SiteNotificationService><unknown>{
            create: () => null
        };
        httpService = <HttpService><unknown>{
            post: () => null
        };

        service = new AuthService(
            httpService,
            siteNotificationService,
            <Router><unknown>{ navigateByUrl: () => null }
        );
    });

    describe('igLoggedIn', () => {
        it('should return false if not logged in', () => {
            // Given
            service.setAuthUser(null);

            // When
            const result = service.isLoggedIn();

            // Then
            expect(result).toBeFalse();
        });
        it('should return true if logged in', () => {
            // Given
            service.setAuthUser(new AuthUser(null));

            // When
            const result = service.isLoggedIn();

            // Then
            expect(result).toBeTrue();
        });
    });

    describe('refreshToken', () => {
        it('should set the correct header', done => {
            // Given
            spyOn(service, 'getRefreshToken').and.returnValue('refresh');
            spyOn(httpService, 'post')
                .and.callFake((_url: string, _body: any, options?: { headers: { [key: string]: string } }) => {
                    // Then
                    expect(options.headers['RefreshAuthorization']).toEqual('refresh');
                    done();
                    return of(null);
                });

            // When
            service.refreshToken();
        });
        it('should update the auth user if refresh is successfull', done => {
            // Given
            service.setAuthUser(new AuthUser({ username: 'something' }));
            spyOn(httpService, 'post').and.returnValue(of(new AuthUser({ username: 'test' })));

            // When
            service.refreshToken().pipe(take(1)).subscribe(() => {
                // Then
                expect(service.getAuthUser().username).toEqual('test');
                done();
            });
        });
        it('should set auth user to null if failure', done => {
            // Given
            service.setAuthUser(new AuthUser({ username: 'something' }));
            spyOn(httpService, 'post').and.returnValue(throwError('gg'));

            // When
            service.refreshToken().pipe(take(1), catchError(() => {
                // Then
                expect(service.getAuthUser()).toBeNull();
                done();
                return of(null);
            })).subscribe(() => null);
        });
    });

    describe('getAccessToken', () => {
        it('should return the accessToken if logged in', () => {
            // Given
            service.setAuthUser(new AuthUser({ accessToken: 'access' }));

            // When
            const result = service.getAccessToken();

            // Then
            expect(result).toEqual('access');
        });
        it('should return null if not logged in', () => {
            // Given
            service.setAuthUser(null);

            // When
            const result = service.getAccessToken();

            // Then
            expect(result).toBeNull();
        });
    });

    describe('getRefreshToken', () => {
        it('should return the refreshToken if logged in', () => {
            // Given
            service.setAuthUser(new AuthUser({ refreshToken: 'refresh' }));

            // When
            const result = service.getRefreshToken();

            // Then
            expect(result).toEqual('refresh');
        });
        it('should return null if not logged in', () => {
            // Given
            service.setAuthUser(null);

            // When
            const result = service.getRefreshToken();

            // Then
            expect(result).toBeNull();
        });
    });

    it('getAuthUser should return the auth user', () => {
        // Given
        service.setAuthUser(new AuthUser(null));

        // When
        const result = service.getAuthUser();

        // Then
        expect(result).not.toBeNull();
    });
});
