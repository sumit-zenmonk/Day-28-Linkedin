import { faker } from '@faker-js/faker';
import { dataSource, options } from './data-source';
import { UserEntity } from 'src/domain/entities/user.entity';
import { ProfileEntity } from 'src/domain/entities/user.profile.entity';
import { EducationHistoryEntity } from 'src/domain/entities/user.education.history.entity';
import { EmploymentHistoryEntity } from 'src/domain/entities/user.employment.history.entity';
import { PostEntity } from 'src/domain/entities/posts.entity';
import { ImageEntity } from 'src/domain/entities/images.entity';
import { PostInteractionEntity } from 'src/domain/entities/post.interaction.entity';
import { ImageTypeEnum } from 'src/domain/enums/img.';

async function create() {
    dataSource.setOptions({
        ...options,
    });

    await dataSource.initialize();

    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const users: UserEntity[] = [];
        const posts: PostEntity[] = [];

        for (const _ of Array.from(Array(15).keys())) {
            const user = await queryRunner.manager.save(UserEntity, {
                email: faker.internet.email(),
                password: faker.internet.password(),
                name: faker.person.fullName(),
            });

            users.push(user);

            const profile = await queryRunner.manager.save(ProfileEntity, {
                user: user,
                bio: faker.person.bio(),
                mobile_number: faker.phone.number(),
            });

            await queryRunner.manager.save(ImageEntity, {
                profile,
                user_uuid: user.uuid,
                type: ImageTypeEnum.PROFILE,
                image_url: faker.image.urlPicsumPhotos(),
            });
        }

        for (const user of users) {
            await queryRunner.manager.save(EducationHistoryEntity, {
                user: user,
                school_name: faker.company.name(),
                school_url: faker.internet.url(),
                start_date: faker.date.past(),
                end_date: faker.date.recent(),
                specialization: faker.person.jobArea(),
                description: faker.lorem.sentence(),
            });

            await queryRunner.manager.save(EmploymentHistoryEntity, {
                user: user,
                company_name: faker.company.name(),
                company_url: faker.internet.url(),
                start_date: faker.date.past(),
                end_date: faker.date.recent(),
                description: faker.lorem.sentence(),
            });
        }

        for (const user of users) {
            const post = await queryRunner.manager.save(PostEntity, {
                user: user,
                content: faker.lorem.paragraph(),
            });

            posts.push(post);

            await queryRunner.manager.save(ImageEntity, {
                post: post,
                image_url: faker.image.urlPicsumPhotos(),
                user_uuid: user.uuid,
                type: ImageTypeEnum.POST,
            });
        }

        for (const user of users) {
            for (const post of posts) {
                if (Math.random() > 0.6) {
                    await queryRunner.manager.save(PostInteractionEntity, {
                        user: user,
                        post: post,
                        type: 'LIKE',
                    });
                }
            }
        }

        await queryRunner.commitTransaction();
        console.info('✅ Seeded successfully');
    } catch (error) {
        await queryRunner.rollbackTransaction();
        console.error('❌ Something went wrong:', error);
    } finally {
        await queryRunner.release();
    }
}

void create();