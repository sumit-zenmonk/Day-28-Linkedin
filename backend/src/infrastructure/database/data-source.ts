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
import { CompanyEntity } from "src/domain/entities/company.entity";
import { ApplicationEntity } from "src/domain/entities/applications.entity";
import { EmployeeEntity } from "src/domain/entities/employee.entity";
import { JobEntity } from "src/domain/entities/job.entity";
import { JobTagEntity } from "src/domain/entities/job.tag.entity";
import { PostInteractionEntity } from "src/domain/entities/post.interaction.entity";
import { MessageEntity } from "src/domain/entities/message.entity";
import { CommentEntity } from "src/domain/entities/comment.entity";

const options: DataSourceOptions = {
    type: process.env.DB_POSTGRES_TYPE as any,
    host: process.env.DB_POSTGRES_HOST,
    port: process.env.DB_POSTGRES_PORT as any,
    username: process.env.DB_POSTGRES_USERNAME,
    password: process.env.DB_POSTGRES_PASSWORD,
    database: process.env.DB_POSTGRES_DATABASE,
    entities: [
        UserEntity, ProfileEntity, EducationHistoryEntity,
        EmploymentHistoryEntity, PostEntity, ImageEntity,
        ConnectionEntity, ConnectionRequestEntity, CompanyEntity,
        ApplicationEntity, EmployeeEntity, JobEntity,
        JobTagEntity, PostInteractionEntity, MessageEntity,
        CommentEntity
    ],
    synchronize: false,
    migrations: ['dist/infrastructure/database/migrations/*{.ts,.js}'],
};

const dataSource = new DataSource(options);

export { dataSource, options };