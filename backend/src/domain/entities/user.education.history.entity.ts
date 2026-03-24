import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity('education_histories')
export class EducationHistoryEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column()
    user_uuid: string;

    @Column()
    school_name: string;

    @Column({ nullable: true })
    school_url: string;

    @Column({ type: 'date' })
    start_date: Date;

    @Column({ type: 'date', nullable: true })
    end_date: Date;

    @Column({ nullable: true })
    specialization: string;

    @Column({ nullable: true })
    description: string;

    @ManyToOne(() => UserEntity, user => user.education_histories)
    @JoinColumn({ name: 'user_uuid' })
    user: UserEntity;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}