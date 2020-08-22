import { Injectable } from '@angular/core';
import { ITimetable } from './timetable.interface';
import { HttpService } from '../../../core/http/http.service';

@Injectable()
export class TimetableService {

    constructor (private httpService: HttpService) {
    }

    fetchSlots (type: string): Promise<ITimetable> {
        return new Promise(res => {
            const all = [];

            for (let d = 1; d < 8; d++) {
                for (let i = 0; i < 24; i++) {
                    const random = Math.round(Math.random() * 10);
                    if (random % 3) {
                        all.push({
                            user: {
                                username: 'test #1'
                            },
                            day: d,
                            hour: i,
                            isBooked: true,
                            isCurrentSlot: false
                        });
                    } else {
                        all.push({
                            user: null,
                            day: d,
                            hour: i,
                            isBooked: false,
                            isCurrentSlot: false
                        });
                    }
                }
            }

            res({
                type: type,
                all: all,
                current: []
            });
        });
    }
}
