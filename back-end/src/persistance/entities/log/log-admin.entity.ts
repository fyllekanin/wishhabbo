import { LogEntityAbstract } from './log-entity.abstract';
import { Entity } from 'typeorm';

@Entity('log_admin')
export class LogAdminEntity extends LogEntityAbstract {

}
