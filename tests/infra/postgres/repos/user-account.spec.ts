import { newDb } from 'pg-mem';
import { Column, Entity, getRepository, PrimaryGeneratedColumn } from 'typeorm';
import { LoadUserAccountRepository } from '@/data/contracts/repos';

@Entity({ name: 'users' })
class PgUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  email!: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  facebook_id?: string;
}

class PgUserAccountRepository implements LoadUserAccountRepository {
  async load(
    params: LoadUserAccountRepository.Params,
  ): Promise<LoadUserAccountRepository.Result> {
    const pgUserRepo = getRepository(PgUser);

    const user = await pgUserRepo.findOne({
      email: params.email,
    });

    if (!user) return undefined;

    return {
      id: user.id.toString(),
      name: user.name ?? undefined,
    };
  }
}

describe('PgUserAccountRepository', () => {
  describe('load', () => {
    let sut: PgUserAccountRepository;

    beforeAll(async () => {
      const db = newDb();
      db.public.registerFunction({
        name: 'current_database',
        implementation: () => 'test',
      });
      const connection = await db.adapters.createTypeormConnection({
        type: 'postgres',
        entities: [PgUser],
      });
      await connection.synchronize();
      const pgUserRepo = getRepository(PgUser);
      await pgUserRepo.save({
        email: 'existing_email',
      });
    });

    beforeEach(() => {
      sut = new PgUserAccountRepository();
    });

    it('should return an account if email exists', async () => {
      const account = await sut.load({
        email: 'existing_email',
      });

      expect(account).toEqual({ id: '1' });
    });
  });
});
