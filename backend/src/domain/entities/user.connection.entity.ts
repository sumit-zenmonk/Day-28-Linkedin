import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ConnectionStatusEnum } from "../enums/connection.status";
import { UserEntity } from "./user.entity";

@Entity('connections')
export class ConnectionEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column()
    user_uuid: string;

    @Column()
    connected_user_uuid: string;

    @Column({
        type: 'enum',
        enum: ConnectionStatusEnum,
        default: ConnectionStatusEnum.ACTIVE
    })
    status: ConnectionStatusEnum;

    @ManyToOne(() => UserEntity, user => user.connections)
    @JoinColumn({ name: 'user_uuid' })
    user: UserEntity;

    @ManyToOne(() => UserEntity, user => user.connected_to)
    @JoinColumn({ name: 'connected_user_uuid' })
    connected_user: UserEntity;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}