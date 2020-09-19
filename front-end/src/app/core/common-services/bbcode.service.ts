import { Injectable } from '@angular/core';
import { BbcodeClass } from '../../shared/classes/bbcode.class';
import { HttpService } from '../http/http.service';
import { Resolve } from '@angular/router';

@Injectable()
export class BbcodeService implements Resolve<Array<BbcodeClass>> {
    private bbcodes: Array<BbcodeClass> = null;

    constructor (private httpService: HttpService) {
    }

    async resolve (): Promise<Array<BbcodeClass>> {
        return await this.getBbcodes();
    }

    async getBbcodes (): Promise<Array<BbcodeClass>> {
        if (this.bbcodes) {
            return [...this.bbcodes];
        }
        this.bbcodes = await this.httpService.get('/information/bbcodes')
            .toPromise()
            .then((bbcodes: Array<BbcodeClass>) => bbcodes.map(bbcode => new BbcodeClass(bbcode)));
        return [...this.bbcodes];
    }
}
