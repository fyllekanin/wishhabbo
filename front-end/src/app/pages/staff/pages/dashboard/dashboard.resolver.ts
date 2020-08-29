import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { HttpService } from '../../../../core/http/http.service';
import { Observable } from 'rxjs';

@Injectable()
export class DashboardResolver implements Resolve<any> {

    constructor (private httpService: HttpService) {
    }

    resolve (): Observable<any> {
        return this.httpService.get('/staff/dashboard');
    }
}
