import { getRepository } from 'typeorm';

import { LoadUserAccount, SaveFacebookAccount } from '@/domain/contracts/repos';
import { PgUser } from '@/infra/postgres/entities';

type LoadParams = LoadUserAccount.Params;
type LoadResult = LoadUserAccount.Result;
type SaveParams = SaveFacebookAccount.Params;
type SaveResult = SaveFacebookAccount.Result;

export class PgUserAccountRepository
  implements LoadUserAccount, SaveFacebookAccount
{
  async load({ email }: LoadParams): Promise<LoadResult> {
    const pgUserRepo = getRepository(PgUser);

    const user = await pgUserRepo.findOne({
      email,
    });

    if (!user) return undefined;

    return {
      id: user.id.toString(),
      name: user.name ?? undefined,
    };
  }

  async saveWithFacebook(params: SaveParams): Promise<SaveResult> {
    const pgUserRepo = getRepository(PgUser);

    const { email, facebook_id, name, id } = params;
    let resultId: string;

    if (!id) {
      const pgUser = await pgUserRepo.save({ email, name, facebook_id });

      resultId = pgUser.id.toString();
    } else {
      resultId = id;
      await pgUserRepo.update({ id: Number(id) }, { name, facebook_id });
    }

    return {
      id: resultId,
    };
  }
}
