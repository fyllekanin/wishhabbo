import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CreatedUpdatedAtEntity } from '../created-updated-at.entity';

interface IJobApplicationEntity {
    jobApplicationId: number;
    userId: number;
    discord: string;
    roles: string;
    content: string;
    resolved: boolean;
}

@Entity('job_applications')
export class JobApplicationEntity extends CreatedUpdatedAtEntity implements IJobApplicationEntity {
    @PrimaryGeneratedColumn()
    jobApplicationId: number;
    @Column()
    userId: number;
    @Column()
    discord: string;
    @Column()
    roles: string;
    @Column({ type: 'longtext' })
    content: string;
    @Column()
    resolved: boolean;

    constructor (builder: IJobApplicationEntity) {
        super();
        if (!builder) {
            return;
        }

        this.jobApplicationId = builder.jobApplicationId;
        this.userId = builder.userId;
        this.discord = builder.discord;
        this.roles = builder.roles;
        this.content = builder.content;
        this.resolved = builder.resolved;
    }


    newBuilderFromCurrent (): Builder {
        return new Builder(this);
    }

    static newBuilder (): Builder {
        return new Builder();
    }
}

class Builder {
    private myData: IJobApplicationEntity = {
        jobApplicationId: undefined,
        userId: undefined,
        discord: undefined,
        roles: undefined,
        content: undefined,
        resolved: undefined
    };

    constructor (entity?: IJobApplicationEntity) {
        Object.assign(this.myData, entity);
    }

    withJobApplicationid (jobApplicationId: number): Builder {
        this.myData.jobApplicationId = jobApplicationId;
        return this;
    }

    withUserId (userId: number): Builder {
        this.myData.userId = userId;
        return this;
    }

    withDiscord (discord: string): Builder {
        this.myData.discord = discord;
        return this;
    }

    withRoles (roles: Array<number>): Builder {
        this.myData.roles = roles.join(',');
        return this;
    }

    withContent (content: string): Builder {
        this.myData.content = content;
        return this;
    }

    withResolved (resolved: boolean): Builder {
        this.myData.resolved = resolved;
        return this;
    }

    build (): JobApplicationEntity {
        return new JobApplicationEntity(this.myData);
    }
}
