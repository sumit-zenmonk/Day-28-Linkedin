import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class EducationHistoriesMigration1773912000002 implements MigrationInterface {
    name = "EducationHistoriesMigration1773912000002";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "education_histories",
                columns: [
                    { name: "uuid", type: "uuid", isPrimary: true, isGenerated: false, default: "uuid_generate_v4()" },
                    { name: "user_uuid", type: "uuid", isNullable: false },
                    { name: "school_name", type: "varchar", isNullable: false },
                    { name: "school_url", type: "varchar", isNullable: true },
                    { name: "start_date", type: "date", isNullable: false },
                    { name: "end_date", type: "date", isNullable: true },
                    { name: "specialization", type: "varchar", isNullable: true },
                    { name: "description", type: "varchar", isNullable: true },
                    { name: "created_at", type: "timestamp", default: "now()" },
                    { name: "updated_at", type: "timestamp", default: "now()" },
                    { name: "deleted_at", type: "timestamp", isNullable: true },
                ],
            }),
            true
        );

        await queryRunner.createForeignKey(
            "education_histories",
            new TableForeignKey({
                columnNames: ["user_uuid"],
                referencedTableName: "users",
                referencedColumnNames: ["uuid"],
                onDelete: "CASCADE",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("education_histories", true);
    }
}