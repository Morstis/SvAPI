import { MigrationInterface, QueryRunner, getRepository } from 'typeorm';
import { User } from '../entity/User';

export class CreateAdminUser1547919837483 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    let user = new User();
    user.email = 'admin';
    user.klasse = 'admin';
    user.nachname = 'admin';
    user.uid = 'admin';
    user.vorname = 'admin';
    user.password = '1FXPLL2E';
    user.hashPassword();
    user.role = 'ADMIN';
    user.verified = true;
    const userRepository = getRepository(User);
    await userRepository.save(user);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
