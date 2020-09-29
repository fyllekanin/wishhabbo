import { Component } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
    selector: 'app-auth-register',
    templateUrl: 'register.component.html',
    styleUrls: ['register.component.css']
})
export class RegisterComponent {
    data = {
        username: null,
        password: null,
        repassword: null,
        habbo: null
    };

    constructor (private authService: AuthService) {
    }

    async onRegister (): Promise<void> {
        await this.authService.doRegister(this.data);
    }
}
