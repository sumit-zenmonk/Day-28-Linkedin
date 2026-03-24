import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { ImageEntity } from "./images.entity";

@Entity('profiles')
export class ProfileEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column()
    user_uuid: string;

    @Column({ nullable: true })
    bio: string;

    @Column({ nullable: true })
    mobile_number: string;

    @OneToOne(() => UserEntity, user => user.profile)
    @JoinColumn({ name: 'user_uuid' })
    user: UserEntity;

    @OneToOne(() => ImageEntity, image => image.profile, { eager: true })
    profile_img: ImageEntity;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}