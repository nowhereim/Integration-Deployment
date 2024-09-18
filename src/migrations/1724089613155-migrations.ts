import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1724089613155 implements MigrationInterface {
  name = 'Migrations1724089613155';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`reservation_entity\` (\`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`userId\` int NOT NULL, \`concertId\` int NOT NULL, \`seatId\` int NOT NULL, \`status\` varchar(255) NOT NULL, \`price\` int NOT NULL, \`concertName\` varchar(255) NOT NULL, \`seatNumber\` int NOT NULL, \`openAt\` datetime NOT NULL, \`closeAt\` datetime NOT NULL, INDEX \`idx_seat_id\` (\`seatId\`), INDEX \`idx_concert_id\` (\`concertId\`), INDEX \`idx_user_id\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`payment_entity\` (\`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`userId\` int NOT NULL, \`seatNumber\` int NOT NULL, \`concertName\` varchar(255) NOT NULL, \`openAt\` datetime NOT NULL, \`closeAt\` datetime NOT NULL, \`totalAmount\` int NULL, \`status\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`cash_entity\` (\`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`balance\` int NOT NULL, \`version\` int NOT NULL, \`userId\` int NULL, UNIQUE INDEX \`REL_47ff582da354a51a846d1d472b\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user_entity\` (\`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`outbox_entity\` (\`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`event\` text NOT NULL, \`transactionId\` text NOT NULL, \`eventType\` varchar(255) NOT NULL, \`status\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`cash_history_entity\` (\`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`userId\` int NOT NULL, \`amount\` int NOT NULL, \`type\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`concert_entity\` (\`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`seat_entity\` (\`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`id\` bigint NOT NULL AUTO_INCREMENT, \`isActive\` tinyint NOT NULL, \`seatNumber\` int NOT NULL, \`price\` int NOT NULL, \`version\` int NOT NULL, \`concertScheduleId\` bigint NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`concert_schedule_entity\` (\`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`id\` bigint NOT NULL AUTO_INCREMENT, \`totalSeats\` int NOT NULL, \`reservedSeats\` int NOT NULL DEFAULT '0', \`openAt\` datetime NOT NULL, \`closeAt\` datetime NOT NULL, \`bookingStartAt\` datetime NOT NULL, \`bookingEndAt\` datetime NOT NULL, \`version\` int NOT NULL, \`concertId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`cash_entity\` ADD CONSTRAINT \`FK_47ff582da354a51a846d1d472bb\` FOREIGN KEY (\`userId\`) REFERENCES \`user_entity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`seat_entity\` ADD CONSTRAINT \`FK_190e10a03a0cdc5dbbff63d748e\` FOREIGN KEY (\`concertScheduleId\`) REFERENCES \`concert_schedule_entity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`concert_schedule_entity\` ADD CONSTRAINT \`FK_da96da4e4ece223e8df7fc615a9\` FOREIGN KEY (\`concertId\`) REFERENCES \`concert_entity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`concert_schedule_entity\` DROP FOREIGN KEY \`FK_da96da4e4ece223e8df7fc615a9\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`seat_entity\` DROP FOREIGN KEY \`FK_190e10a03a0cdc5dbbff63d748e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`cash_entity\` DROP FOREIGN KEY \`FK_47ff582da354a51a846d1d472bb\``,
    );
    await queryRunner.query(`DROP TABLE \`concert_schedule_entity\``);
    await queryRunner.query(`DROP TABLE \`seat_entity\``);
    await queryRunner.query(`DROP TABLE \`concert_entity\``);
    await queryRunner.query(`DROP TABLE \`cash_history_entity\``);
    await queryRunner.query(`DROP TABLE \`outbox_entity\``);
    await queryRunner.query(`DROP TABLE \`user_entity\``);
    await queryRunner.query(
      `DROP INDEX \`REL_47ff582da354a51a846d1d472b\` ON \`cash_entity\``,
    );
    await queryRunner.query(`DROP TABLE \`cash_entity\``);
    await queryRunner.query(`DROP TABLE \`payment_entity\``);
    await queryRunner.query(
      `DROP INDEX \`idx_user_id\` ON \`reservation_entity\``,
    );
    await queryRunner.query(
      `DROP INDEX \`idx_concert_id\` ON \`reservation_entity\``,
    );
    await queryRunner.query(
      `DROP INDEX \`idx_seat_id\` ON \`reservation_entity\``,
    );
    await queryRunner.query(`DROP TABLE \`reservation_entity\``);
  }
}
