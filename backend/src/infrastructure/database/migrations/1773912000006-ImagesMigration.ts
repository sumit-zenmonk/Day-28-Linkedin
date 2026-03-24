import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class ImagesMigration1773912000006 implements MigrationInterface {
    name = "ImagesMigration1773912000006";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "public"."images_type_enum" AS ENUM('profile', 'post')`
        );

        await queryRunner.createTable(
            new Table({
                name: "images",
                columns: [
                    { name: "uuid", type: "uuid", isPrimary: true, isGenerated: false, default: "uuid_generate_v4()" },
                    { name: "user_uuid", type: "uuid", isNullable: false },
                    { name: "type", type: "images_type_enum", isNullable: false },
                    { name: "image_url", type: "varchar", isNullable: false },
                    { name: "post_uuid", type: "uuid", isNullable: true },
                    { name: "profile_uuid", type: "uuid", isNullable: true },
                    { name: "created_at", type: "timestamp", default: "now()" },
                    { name: "updated_at", type: "timestamp", default: "now()" },
                    { name: "deleted_at", type: "timestamp", isNullable: true },
                ],
            }),
            true
        );

        await queryRunner.createForeignKeys("images", [
            new TableForeignKey({
                name: "FK_images_post",
                columnNames: ["post_uuid"],
                referencedTableName: "posts",
                referencedColumnNames: ["uuid"],
                onDelete: "CASCADE",
            }),
            new TableForeignKey({
                name: "FK_images_profile",
                columnNames: ["profile_uuid"],
                referencedTableName: "profiles",
                referencedColumnNames: ["uuid"],
                onDelete: "CASCADE",
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("images", true);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."images_type_enum"`);
    }
}