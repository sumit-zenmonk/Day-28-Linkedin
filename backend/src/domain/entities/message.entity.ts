import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity('messages')
export class MessageEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({ type: 'text' })
    content: string;

    @Column()
    sender_uuid: string;

    @Column()
    receiver_uuid: string;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'sender_uuid' })
    sender: UserEntity;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'receiver_uuid' })
    receiver: UserEntity;

    @CreateDateColumn()
    created_at: Date;
}
