import { Entity } from 'typeorm';
import { LogEntityAbstract } from './log-entity.abstract';

@Entity('log_user')
export class LogUserEntity extends LogEntityAbstract {

}
