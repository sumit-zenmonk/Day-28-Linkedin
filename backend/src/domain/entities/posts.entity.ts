import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { ImageEntity } from "./images.entity";
import { PostInteractionEntity } from "./post.interaction.entity";
import { CommentEntity } from "./comment.entity";

@Entity('posts')
export class PostEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column()
    user_uuid: string;

    @Column({ type: 'text' })
    content: string;

    @OneToMany(() => ImageEntity, image => image.post)
    images: ImageEntity[];

    @ManyToOne(() => UserEntity, user => user.posts)
    @JoinColumn({ name: 'user_uuid' })
    user: UserEntity;

    @OneToMany(() => PostInteractionEntity, postInteract => postInteract.post, { eager: true })
    liked_by: PostInteractionEntity[];

    @OneToMany(() => CommentEntity, (comment) => comment.post, { eager: true })
    comments: CommentEntity[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}