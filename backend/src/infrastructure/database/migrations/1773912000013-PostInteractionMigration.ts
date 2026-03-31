import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class PostInteractionMigration1773912000013 implements MigrationInterface {
    name = "PostInteractionMigration1773912000013";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "post_interaction",
                columns: [
                    { name: "uuid", type: "uuid", isPrimary: true, isGenerated: true, generationStrategy: "uuid", default: "uuid_generate_v4()", },
                    { name: "user_uuid", type: "uuid", isNullable: false, },
                    { name: "post_uuid", type: "uuid", isNullable: false, },
                    { name: "content", type: "varchar", isNullable: false, },
                    { name: "created_at", type: "timestamp", default: "now()", },
                    { name: "updated_at", type: "timestamp", default: "now()", },
                    { name: "deleted_at", type: "timestamp", isNullable: true, },
                ],
            }),
            true
        );

        await queryRunner.createForeignKey(
            "post_interaction",
            new TableForeignKey({
                columnNames: ["user_uuid"],
                referencedTableName: "users",
                referencedColumnNames: ["uuid"],
                onDelete: "CASCADE",
            })
        );

        await queryRunner.createForeignKey(
            "post_interaction",
            new TableForeignKey({
                columnNames: ["post_uuid"],
                referencedTableName: "posts",
                referencedColumnNames: ["uuid"],
                onDelete: "CASCADE",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("post_interaction", true);
    }
}