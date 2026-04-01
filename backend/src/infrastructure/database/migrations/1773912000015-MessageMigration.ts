import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CommentsMigration1773912000015 implements MigrationInterface {
    name = "CommentsMigration1773912000015";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "comments",
                columns: [
                    { name: "uuid", type: "uuid", isPrimary: true, isGenerated: true, generationStrategy: "uuid", default: "uuid_generate_v4()", },
                    { name: "user_uuid", type: "uuid", isNullable: false, },
                    { name: "post_uuid", type: "uuid", isNullable: false, },
                    { name: "parent_uuid", type: "uuid", isNullable: true, },
                    { name: "comment", type: "text", isNullable: false, },
                    { name: "created_at", type: "timestamp", default: "now()", },
                    { name: "updated_at", type: "timestamp", default: "now()", },
                    { name: "deleted_at", type: "timestamp", isNullable: true, },
                ],
            }),
            true
        );

        await queryRunner.createForeignKey(
            "comments",
            new TableForeignKey({
                columnNames: ["post_uuid"],
                referencedTableName: "posts",
                referencedColumnNames: ["uuid"],
                onDelete: "CASCADE",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("comments", true);
    }
}
