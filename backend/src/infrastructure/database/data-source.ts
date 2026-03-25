//Data-Source imports
import { DataSource, DataSourceOptions } from "typeorm";
import 'dotenv/config';

//Entities
import { UserEntity } from "src/domain/entities/user.entity";
import { ProfileEntity } from "src/domain/entities/user.profile.entity";
import { EducationHistoryEntity } from "src/domain/entities/user.education.history.entity";
import { EmploymentHistoryEntity } from "src/domain/entities/user.employment.history.entity";
import { ImageEntity } from "src/domain/entities/images.entity";
import { ConnectionEntity } from "src/domain/entities/user.connection.entity";
import { PostEntity } from "src/domain/entities/posts.entity";
import { ConnectionRequestEntity } from "src/domain/entities/user.connection.request.entity";

const options: DataSourceOptions = {
    type: process.env.DB_POSTGRES_TYPE as any,
    host: process.env.DB_POSTGRES_HOST,
    port: process.env.DB_POSTGRES_PORT as any,
    username: process.env.DB_POSTGRES_USERNAME,
    password: process.env.DB_POSTGRES_PASSWORD,
    database: process.env.DB_POSTGRES_DATABASE,
    entities: [UserEntity, ProfileEntity, EducationHistoryEntity, EmploymentHistoryEntity, PostEntity, ImageEntity, ConnectionEntity, ConnectionRequestEntity],
    synchronize: false,
    migrations: ['dist/infrastructure/database/migrations/*{.ts,.js}'],
};

const dataSource = new DataSource(options);

export { dataSource };