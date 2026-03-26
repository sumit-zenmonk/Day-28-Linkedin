import { RoleEnum } from "src/domain/enums/user";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ProfileEntity } from "./user.profile.entity";
import { EmploymentHistoryEntity } from "./user.employment.history.entity";
import { EducationHistoryEntity } from "./user.education.history.entity";
import { PostEntity } from "./posts.entity";
import { ImageEntity } from "./images.entity";
import { ConnectionEntity } from "./user.connection.entity";
import { CompanyEntity } from "./company.entity";

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({
        type: 'enum',
        enum: RoleEnum,
        default: RoleEnum.USER,
    })
    role: RoleEnum;

    @OneToOne(() => ProfileEntity, profile => profile.user)
    profile: ProfileEntity;

    @OneToMany(() => EmploymentHistoryEntity, emp => emp.user)
    employment_histories: EmploymentHistoryEntity[];

    @OneToMany(() => EducationHistoryEntity, edu => edu.user)
    education_histories: EducationHistoryEntity[];

    @OneToMany(() => PostEntity, post => post.user)
    posts: PostEntity[];

    @OneToMany(() => ConnectionEntity, conn => conn.user)
    connections: ConnectionEntity[];

    @OneToMany(() => ConnectionEntity, conn => conn.connected_user)
    connected_to: ConnectionEntity[];

    @OneToOne(() => CompanyEntity, company => company.user)
    company: CompanyEntity;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}