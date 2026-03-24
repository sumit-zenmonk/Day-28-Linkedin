import { faker } from '@faker-js/faker';
import { dataSource } from './data-source';
import { UserEntity } from 'src/domain/entities/user.entity';
import { ProfileEntity } from 'src/domain/entities/user.profile.entity';
import { EducationHistoryEntity } from 'src/domain/entities/user.education.history.entity';
import { EmploymentHistoryEntity } from 'src/domain/entities/user.employment.history.entity';
import { PostEntity } from 'src/domain/entities/posts.entity';
import { ImageEntity } from 'src/domain/entities/images.entity';
import { ConnectionEntity } from 'src/domain/entities/user.connection.entity';

async function create() {
    dataSource.setOptions({
        entities: [UserEntity, ProfileEntity, EducationHistoryEntity, EmploymentHistoryEntity, PostEntity, ImageEntity, ConnectionEntity],
    });

    await dataSource.initialize();

    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const _ of Array.from(Array(5).keys())) {
            const user = await queryRunner.manager.save(UserEntity, {
                email: faker.internet.email(),
                password: faker.internet.password(),
                name: faker.person.fullName(),
            });

            await queryRunner.manager.save(ProfileEntity, {
                user: user,
                bio: faker.person.bio(),
                mobile_number: faker.phone.number(),
            });
        }

        await queryRunner.commitTransaction();
        console.info('Users + Profiles seeded successfully');
    } catch (error) {
        await queryRunner.rollbackTransaction();
        console.error('Something went wrong:', error);
    } finally {
        await queryRunner.release();
    }
}

void create();