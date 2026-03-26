import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CompanyMigration1773912000008 implements MigrationInterface {
    name = "CompanyMigration1773912000008";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "company",
                columns: [
                    { name: "uuid", type: "uuid", isPrimary: true, isGenerated: true, generationStrategy: "uuid", default: "uuid_generate_v4()", },
                    { name: "user_uuid", type: "uuid", isNullable: false, isUnique: true, },
                    { name: "name", type: "varchar", isNullable: false, },
                    { name: "email", type: "varchar", isNullable: false, },
                    { name: "mobile_number", type: "varchar", isNullable: false, },
                    { name: "industry", type: "varchar", isNullable: false, },
                    { name: "description", type: "text", isNullable: false, },
                    { name: "location", type: "varchar", isNullable: false, },
                    { name: "created_at", type: "timestamp", default: "now()", },
                    { name: "updated_at", type: "timestamp", default: "now()", },
                    { name: "deleted_at", type: "timestamp", isNullable: true, },
                ],
            }),
            true
        );

        await queryRunner.createForeignKey(
            "company",
            new TableForeignKey({
                columnNames: ["user_uuid"],
                referencedTableName: "users",
                referencedColumnNames: ["uuid"],
                onDelete: "CASCADE",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("company", true);
    }
}