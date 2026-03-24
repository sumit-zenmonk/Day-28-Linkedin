import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class UsersMigration1773912000000 implements MigrationInterface {
    name = "UsersMigration1773912000000";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "public"."users_role_enum" AS ENUM('user', 'company')`
        );

        await queryRunner.createTable(
            new Table({
                name: "users",
                columns: [
                    { name: "uuid", type: "uuid", isPrimary: true, isGenerated: false, default: "uuid_generate_v4()" },
                    { name: "name", type: "varchar", isNullable: false },
                    { name: "email", type: "varchar", isUnique: true, isNullable: false },
                    { name: "password", type: "varchar", isNullable: false },
                    { name: "role", type: "users_role_enum", default: `'user'`, isNullable: false },
                    { name: "created_at", type: "timestamp", default: "now()" },
                    { name: "updated_at", type: "timestamp", default: "now()" },
                    { name: "deleted_at", type: "timestamp", isNullable: true },
                ]
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("users", true);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."users_role_enum"`);
    }
}