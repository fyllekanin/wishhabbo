import { BeforeInsert, BeforeUpdate, Column, Index } from 'typeorm';
import { IEntity } from './entity.interface';
import { TimeUtility } from '../../utilities/time.utility';

export class CreatedUpdatedAtEntity implements IEntity {
    @Column()
    @Index()
    createdAt: number;

    @Column()
    @Index()
    updatedAt: number;

    @BeforeInsert()
    async beforeInsert () {
        const time = TimeUtility.getCurrent();
        this.createdAt = time;
        this.updatedAt = time;
    }

    @BeforeUpdate()
    async beforeUpdate () {
        this.updatedAt = TimeUtility.getCurrent();
    }
}
