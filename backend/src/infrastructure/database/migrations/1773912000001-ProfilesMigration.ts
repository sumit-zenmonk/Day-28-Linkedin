import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class ProfilesMigration1773912000001 implements MigrationInterface {
    name = "ProfilesMigration1773912000001";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "profiles",
                columns: [
                    { name: "uuid", type: "uuid", isPrimary: true, isGenerated: false, default: "uuid_generate_v4()", },
                    { name: "user_uuid", type: "uuid", isNullable: false, },
                    { name: "bio", type: "varchar", isNullable: true, },
                    { name: "mobile_number", type: "varchar", isNullable: true, },
                    { name: "created_at", type: "timestamp", default: "now()", },
                    { name: "updated_at", type: "timestamp", default: "now()", },
                    { name: "deleted_at", type: "timestamp", isNullable: true, },
                ],
            }),
            true
        );

        await queryRunner.createForeignKey(
            "profiles",
            new TableForeignKey({
                columnNames: ["user_uuid"],
                referencedTableName: "users",
                referencedColumnNames: ["uuid"],
                onDelete: "CASCADE",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("profiles", true);
    }
}