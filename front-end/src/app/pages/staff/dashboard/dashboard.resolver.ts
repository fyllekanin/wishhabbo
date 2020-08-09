import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { HttpService } from '../../../core/http/http.service';
import { Observable } from 'rxjs';

@Injectable()
export class DashboardResolver implements Resolve<Object> {

    constructor (private httpService: HttpService) {
    }

    resolve (): Observable<Object> {
        return this.httpService.get('/staff/dashboard');
    }
}
