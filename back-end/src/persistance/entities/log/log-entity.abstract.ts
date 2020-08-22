import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { CreatedUpdatedAtEntity } from '../created-updated-at.entity';

export class LogEntityAbstract extends CreatedUpdatedAtEntity {
    @PrimaryGeneratedColumn()
    logId: number;
    @Column()
    id: number;
    @Column()
    contentId: number;
    @Column()
    userId: number;
    @Column({ nullable: true, type: 'longtext' })
    beforeChange: string;
    @Column({ nullable: true, type: 'longtext' })
    afterChange: string;
}
