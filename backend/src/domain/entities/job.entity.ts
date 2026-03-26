import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CompanyEntity } from "./company.entity";
import { ApplicationEntity } from "./applications.entity";

@Entity('job')
export class JobEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column()
    company_uuid: string;

    @Column()
    position: string;

    @Column()
    location: string;

    @Column()
    role: string;

    @Column({ type: "int" })
    min_salary: number;

    @Column({ type: "int" })
    max_salary: number;

    @ManyToOne(() => CompanyEntity, (company) => company.jobs)
    @JoinColumn({ name: "company_uuid" })
    company: CompanyEntity[];

    @OneToMany(() => ApplicationEntity, (application) => application.job)
    applications: ApplicationEntity[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}