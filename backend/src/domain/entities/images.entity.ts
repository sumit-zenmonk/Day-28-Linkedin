import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ImageTypeEnum } from "../enums/img.type";
import { UserEntity } from "./user.entity";
import { PostEntity } from "./posts.entity";
import { ProfileEntity } from "./user.profile.entity";

@Entity('images')
export class ImageEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column()
    user_uuid: string;

    @Column({
        type: 'enum',
        enum: ImageTypeEnum
    })
    type: ImageTypeEnum;

    @Column()
    image_url: string;

    @Column({ nullable: true })
    post_uuid: string;

    @Column({ nullable: true })
    profile_uuid: string;

    @ManyToOne(() => PostEntity, post => post.images, { nullable: true })
    @JoinColumn({ name: 'post_uuid' })
    post: PostEntity;

    @OneToOne(() => ProfileEntity, profile => profile.profile_img)
    @JoinColumn({ name: 'profile_uuid' })
    profile: ProfileEntity;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}