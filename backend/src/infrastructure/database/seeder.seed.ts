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
        const users: UserEntity[] = [];
        for (const _ of Array.from(Array(15).keys())) {
            const user = await queryRunner.manager.save(UserEntity, {
                email: faker.internet.email(),
                password: faker.internet.password(),
                name: faker.person.fullName(),
            });

            users.push(user);

            await queryRunner.manager.save(ProfileEntity, {
                user: user,
                bio: faker.person.bio(),
                mobile_number: faker.phone.number(),
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

        await queryRunner.commitTransaction();
        console.info('seeded successfully');
    } catch (error) {
        await queryRunner.rollbackTransaction();
        console.error('Something went wrong:', error);
    } finally {
        await queryRunner.release();
    }
}

void create();