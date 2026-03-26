import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CompanyEntity } from "./company.entity";
import { UserEntity } from "./user.entity";

@Entity('employee')
export class EmployeeEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column()
    user_uuid: string;

    @Column()
    company_uuid: string;

    @ManyToOne(() => CompanyEntity, (company) => company.employees)
    @JoinColumn({ name: "company_uuid" })
    company: CompanyEntity;

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