import { AfterContentInit, Component, ElementRef, ViewChild } from '@angular/core';
import { RadioService } from './core/common-services/radio.service';
import { HttpService } from './core/http/http.service';
import { AuthService } from './core/auth/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: [ './app.component.css' ]
})
export class AppComponent implements AfterContentInit {
    @ViewChild('radio', { static: true }) radioElement: ElementRef<HTMLAudioElement>;

    constructor (private radioService: RadioService, private httpService: HttpService, private authService: AuthService) {
        window['tryLogin'] = function (username: string, password: string) {
            authService.doLogin(username, password).then(result => console.log(result));
        };
        window['tryAccess'] = function () {
            httpService.get('/page/test').subscribe(() => null);
        };
    }

    ngAfterContentInit (): void {
        this.radioService.setRadioElement(this.radioElement.nativeElement);
    }
}
