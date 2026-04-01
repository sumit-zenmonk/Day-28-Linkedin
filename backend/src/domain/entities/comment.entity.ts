import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PostEntity } from "./posts.entity";
import { UserEntity } from "./user.entity";

@Entity("comments")
export class CommentEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({ type: "uuid" })
    user_uuid: string;

    @Column({ type: "uuid" })
    post_uuid: string;

    @Column({ type: "uuid", nullable: true })
    parent_uuid: string;

    @Column({ type: "text" })
    comment: string;

    @ManyToOne(() => PostEntity, (post) => post.comments)
    @JoinColumn({ name: "post_uuid" })
    post: PostEntity;

    @ManyToOne(() => UserEntity, (user) => user.uuid)
    @JoinColumn({ name: "user_uuid" })
    user: UserEntity;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}