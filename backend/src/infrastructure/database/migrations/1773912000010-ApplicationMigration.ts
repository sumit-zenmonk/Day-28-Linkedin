import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class ApplicationMigration1773912000010 implements MigrationInterface {
    name = "ApplicationMigration1773912000010";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "application",
                columns: [
                    { name: "uuid", type: "uuid", isPrimary: true, isGenerated: true, generationStrategy: "uuid", default: "uuid_generate_v4()", },
                    { name: "job_uuid", type: "uuid", isNullable: false, },
                    { name: "user_uuid", type: "uuid", isNullable: false, },
                    { name: "created_at", type: "timestamp", default: "now()", },
                    { name: "updated_at", type: "timestamp", default: "now()", },
                    { name: "deleted_at", type: "timestamp", isNullable: true, },
                ],
            }),
            true
        );

        await queryRunner.createForeignKey(
            "application",
            new TableForeignKey({
                columnNames: ["job_uuid"],
                referencedTableName: "job",
                referencedColumnNames: ["uuid"],
                onDelete: "CASCADE",
            })
        );

        await queryRunner.createForeignKey(
            "application",
            new TableForeignKey({
                columnNames: ["user_uuid"],
                referencedTableName: "users",
                referencedColumnNames: ["uuid"],
                onDelete: "CASCADE",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("application", true);
    }
}