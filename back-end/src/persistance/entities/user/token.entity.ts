import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CreatedUpdatedAtEntity } from '../created-updated-at.entity';

@Entity('tokens')
export class TokenEntity extends CreatedUpdatedAtEntity {
    @PrimaryGeneratedColumn()
    tokenId: number;
    @Column()
    userId: number;
    @Column()
    access: string;
    @Column()
    refresh: string;
}
