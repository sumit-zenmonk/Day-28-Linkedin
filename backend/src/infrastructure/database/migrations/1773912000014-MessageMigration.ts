import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class MessageMigration1773912000014 implements MigrationInterface {
    name = "MessageMigration1773912000014";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "messages",
                columns: [
                    { name: "uuid", type: "uuid", isPrimary: true, isGenerated: true, generationStrategy: "uuid", default: "uuid_generate_v4()", },
                    { name: "content", type: "text", isNullable: false, },
                    { name: "sender_uuid", type: "uuid", isNullable: false, },
                    { name: "receiver_uuid", type: "uuid", isNullable: false, },
                    { name: "created_at", type: "timestamp", default: "now()", },
                ],
            }),
            true
        );

        await queryRunner.createForeignKey(
            "messages",
            new TableForeignKey({
                columnNames: ["sender_uuid"],
                referencedTableName: "users",
                referencedColumnNames: ["uuid"],
                onDelete: "CASCADE",
            })
        );

        await queryRunner.createForeignKey(
            "messages",
            new TableForeignKey({
                columnNames: ["receiver_uuid"],
                referencedTableName: "users",
                referencedColumnNames: ["uuid"],
                onDelete: "CASCADE",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("messages", true);
    }
}
