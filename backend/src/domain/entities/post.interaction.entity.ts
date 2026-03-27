import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { PostEntity } from "./posts.entity";

@Entity('post_interaction')
export class PostInteractionEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column()
    user_uuid: string;

    @Column()
    post_uuid: string;

    @ManyToOne(() => UserEntity, (user) => user.liked_posts)
    @JoinColumn({ name: "user_uuid" })
    user: UserEntity;

    @ManyToOne(() => PostEntity, (post) => post.liked_by)
    @JoinColumn({ name: "post_uuid" })
    post: PostEntity;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}