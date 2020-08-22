import { Entity } from 'typeorm';
import { LogEntityAbstract } from './log-entity.abstract';

@Entity('log_staff')
export class LogStaffEntity extends LogEntityAbstract {

}
