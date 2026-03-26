import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { JobEntity } from "./job.entity";

@Entity('job_tag')
export class JobTagEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column()
    job_uuid: string;

    @Column()
    tag: string;

    @ManyToOne(() => JobEntity, (job) => job.tags)
    @JoinColumn({ name: "job_uuid" })
    job: JobEntity;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}