import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity('employment_histories')
export class EmploymentHistoryEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column()
    user_uuid: string;

    @Column()
    company_name: string;

    @Column({ nullable: true })
    company_url: string;

    @Column({ type: 'date' })
    start_date: Date;

    @Column({ type: 'date', nullable: true })
    end_date: Date;

    @Column({ nullable: true })
    description: string;

    @ManyToOne(() => UserEntity, user => user.employment_histories)
    @JoinColumn({ name: 'user_uuid' })
    user: UserEntity;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}