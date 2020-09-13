import { Column, Index, PrimaryGeneratedColumn } from 'typeorm';
import { CreatedUpdatedAtEntity } from '../created-updated-at.entity';
import { LogTypes } from '../../../logging/log.types';

export interface ILogEntityAbstract {
    logId: number;
    id: LogTypes;
    contentId: number;
    userId: number;
    beforeChange: string;
    afterChange: string;
    ip: string;
}

export abstract class LogEntityAbstract extends CreatedUpdatedAtEntity implements ILogEntityAbstract {
    @PrimaryGeneratedColumn()
    logId: number;
    @Column()
    @Index()
    id: number;
    @Column()
    @Index()
    contentId: number;
    @Column()
    @Index()
    userId: number;
    @Column({ nullable: true, type: 'longtext' })
    @Index({ fulltext: true })
    beforeChange: string;
    @Column({ nullable: true, type: 'longtext' })
    @Index({ fulltext: true })
    afterChange: string;
    @Column()
    @Index()
    ip: string;

    constructor (builder: ILogEntityAbstract) {
        super();
        if (!builder) {
            return;
        }

        this.logId = builder.logId;
        this.id = builder.id;
        this.contentId = builder.contentId;
        this.userId = builder.userId;
        this.beforeChange = builder.beforeChange;
        this.afterChange = builder.afterChange;
        this.ip = builder.ip;
    }
}

export abstract class LogBuilder<T> {
    protected myData: ILogEntityAbstract = {
        logId: undefined,
        id: undefined,
        contentId: undefined,
        userId: undefined,
        beforeChange: undefined,
        afterChange: undefined,
        ip: undefined
    };

    constructor (entity?: LogEntityAbstract) {
        Object.assign(this.myData, entity);
    }

    withLogId (logId: number): LogBuilder<T> {
        this.myData.logId = logId;
        return this;
    }

    withId (id: number): LogBuilder<T> {
        this.myData.id = id;
        return this;
    }

    withContentId (contentId: number): LogBuilder<T> {
        this.myData.contentId = contentId;
        return this;
    }

    withUserId (userId: number): LogBuilder<T> {
        this.myData.userId = userId;
        return this;
    }

    withBeforeChange (beforeChange: string): LogBuilder<T> {
        this.myData.beforeChange = beforeChange;
        return this;
    }

    withAfterChange (afterChange: string): LogBuilder<T> {
        this.myData.afterChange = afterChange;
        return this;
    }

    withIp (ip: string): LogBuilder<T> {
        this.myData.ip = ip;
        return this;
    }

    abstract build (): T;
}
