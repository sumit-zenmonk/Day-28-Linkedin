import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class ConnectionsRequestMigration1773912000004 implements MigrationInterface {
    name = "ConnectionsRequestMigration1773912000004";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "connectionsRequests",
                columns: [
                    { name: "uuid", type: "uuid", isPrimary: true, isGenerated: false, default: "uuid_generate_v4()" },
                    { name: "user_uuid", type: "uuid", isNullable: false },
                    { name: "connected_user_uuid", type: "uuid", isNullable: false },
                    { name: "created_at", type: "timestamp", default: "now()" },
                    { name: "updated_at", type: "timestamp", default: "now()" },
                    { name: "deleted_at", type: "timestamp", isNullable: true },
                ],
            }),
            true
        );

        await queryRunner.createForeignKeys("connectionsRequests", [
            new TableForeignKey({
                columnNames: ["user_uuid"],
                referencedTableName: "users",
                referencedColumnNames: ["uuid"],
                onDelete: "CASCADE",
            }),
            new TableForeignKey({
                columnNames: ["connected_user_uuid"],
                referencedTableName: "users",
                referencedColumnNames: ["uuid"],
                onDelete: "CASCADE",
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("connectionsRequests", true);
    }
}