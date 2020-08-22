import { Routes } from '@angular/router';
import { RadioComponent } from './radio.component';
import { TimetableComponent } from '../../../../shared/components/timetable/timetable.component';
import { TimeTableTypes } from '../../../../shared/components/timetable/timetable.interface';

export const radioRoutes: Routes = [
    {
        path: '',
        component: RadioComponent,
        children: [
            {
                path: 'timetable/:day',
                component: TimetableComponent,
                data: {
                    type: TimeTableTypes.RADIO
                }
            }
        ]
    }
];
