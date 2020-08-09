import { Injectable, Injector } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { HttpService } from './http/http.service';
import { AuthUser } from './auth/auth-user.model';

@Injectable()
export class AppLoadService {

    constructor (private injector: Injector) {
    }

    load (): Promise<any> {
        return new Promise(resolve => {
            const authService: AuthService = this.injector.get(AuthService);
            const httpService: HttpService = this.injector.get(HttpService);

            httpService.get('/auth/initial').subscribe((res: { authUser: AuthUser }) => {
                authService.setAuthUser(res && res.authUser ? res.authUser : null);
                resolve();
            });
        });
    }

}
