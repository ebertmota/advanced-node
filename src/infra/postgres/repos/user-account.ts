import { getRepository } from 'typeorm';

import {
  LoadUserAccountRepository,
  SaveFacebookAccountRepository,
} from '@/domain/contracts/repos';
import { PgUser } from '@/infra/postgres/entities';

type LoadParams = LoadUserAccountRepository.Params;
type LoadResult = LoadUserAccountRepository.Result;
type SaveParams = SaveFacebookAccountRepository.Params;
type SaveResult = SaveFacebookAccountRepository.Result;

export class PgUserAccountRepository
  implements LoadUserAccountRepository, SaveFacebookAccountRepository
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
