import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class JobTagMigration1773912000012 implements MigrationInterface {
    name = "JobTagMigration1773912000012";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "job_tag",
                columns: [
                    { name: "uuid", type: "uuid", isPrimary: true, isGenerated: true, generationStrategy: "uuid", default: "uuid_generate_v4()", },
                    { name: "job_uuid", type: "uuid", isNullable: false, },
                    { name: "tag", type: "varchar", isNullable: false, },
                    { name: "created_at", type: "timestamp", default: "now()", },
                    { name: "updated_at", type: "timestamp", default: "now()", },
                    { name: "deleted_at", type: "timestamp", isNullable: true, },
                ],
            }),
            true
        );

        await queryRunner.createForeignKey(
            "job_tag",
            new TableForeignKey({
                columnNames: ["job_uuid"],
                referencedTableName: "job",
                referencedColumnNames: ["uuid"],
                onDelete: "CASCADE",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("job_tag", true);
    }
}