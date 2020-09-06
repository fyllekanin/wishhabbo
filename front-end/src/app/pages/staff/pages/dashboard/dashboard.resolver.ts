import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { HttpService } from '../../../../core/http/http.service';
import { Observable, of } from 'rxjs';

@Injectable()
export class DashboardResolver implements Resolve<any> {

    constructor (private httpService: HttpService) {
    }

    resolve (): Observable<any> {
        return of(null);
    }
}
