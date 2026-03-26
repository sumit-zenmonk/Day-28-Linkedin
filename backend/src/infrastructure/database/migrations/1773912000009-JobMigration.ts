import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class JobMigration1773912000009 implements MigrationInterface {
    name = "JobMigration1773912000009";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "job",
                columns: [
                    { name: "uuid", type: "uuid", isPrimary: true, isGenerated: true, generationStrategy: "uuid", default: "uuid_generate_v4()", },
                    { name: "company_uuid", type: "uuid", isNullable: false, },
                    { name: "position", type: "varchar", isNullable: false, },
                    { name: "location", type: "varchar", isNullable: false, },
                    { name: "role", type: "varchar", isNullable: false, },
                    { name: "min_salary", type: "int", isNullable: false, },
                    { name: "max_salary", type: "int", isNullable: false, },
                    { name: "created_at", type: "timestamp", default: "now()", },
                    { name: "updated_at", type: "timestamp", default: "now()", },
                    { name: "deleted_at", type: "timestamp", isNullable: true, },
                ],
            }),
            true
        );

        await queryRunner.createForeignKey(
            "job",
            new TableForeignKey({
                columnNames: ["company_uuid"],
                referencedTableName: "company",
                referencedColumnNames: ["uuid"],
                onDelete: "CASCADE",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("job", true);
    }
}