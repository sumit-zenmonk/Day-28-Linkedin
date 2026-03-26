import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { EmployeeEntity } from "./employee.entity";
import { JobEntity } from "./job.entity";
import { UserEntity } from "./user.entity";

@Entity('company')
export class CompanyEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column()
    user_uuid: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    mobile_number: string;

    @Column()
    industry: string;

    @Column({ type: "text" })
    description: string;

    @Column()
    location: string;

    @OneToOne(() => UserEntity, user => user.company)
    @JoinColumn({ name: "user_uuid" })
    user: UserEntity;

    @OneToMany(() => EmployeeEntity, (employee) => employee.company)
    employees: EmployeeEntity[];

    @OneToMany(() => JobEntity, (job) => job.company)
    jobs: JobEntity[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}