import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { JobEntity } from "./job.entity";
import { UserEntity } from "./user.entity";

@Entity('application')
export class ApplicationEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column()
    job_uuid: string;

    @Column()
    user_uuid: string;

    @ManyToOne(() => JobEntity, (job) => job.applications)
    @JoinColumn({ name: "job_uuid" })
    job: JobEntity;

    @OneToOne(() => UserEntity, user => user.company)
    @JoinColumn({ name: "user_uuid" })
    user: UserEntity;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}