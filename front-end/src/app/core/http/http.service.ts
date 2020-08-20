import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class HttpService {
    private static readonly API = '/api';

    constructor (private httpClient: HttpClient) {

    }

    get<T> (url: string, options?: { headers: { [key: string]: string } }): Observable<T> {
        return this.httpClient.get<T>(HttpService.API + url, options);
    }

    post<B, T> (url: string, body: B, options?: { headers: { [key: string]: string } }): Observable<T> {
        return this.httpClient.post<T>(HttpService.API + url, body, options);
    }

    put<T, B> (url: string, body: B, options?: { headers: { [key: string]: string } }): Observable<T> {
        return this.httpClient.put<T>(HttpService.API + url, body, options);
    }

    delete<T> (url: string, options?: { headers: { [key: string]: string } }): Observable<T> {
        return this.httpClient.delete<T>(HttpService.API + url, options);
    }
}
