import { Component } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-auth-login',
    templateUrl: 'login.component.html',
    styleUrls: [ 'login.component.css' ]
})
export class LoginComponent {
    username: string;
    password: string;

    wasLoginFailed = false;

    constructor (private authService: AuthService, private router: Router) {
    }

    onLogin (): void {
        this.authService.doLogin(this.username, this.password).then(result => {
            this.wasLoginFailed = !result;
            if (result) {
                this.router.navigateByUrl('/');
            }
        });
    }
}
