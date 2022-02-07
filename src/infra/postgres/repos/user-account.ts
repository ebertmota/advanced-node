import { getRepository } from 'typeorm';

import {
  LoadUserAccountRepository,
  SaveFacebookAccountRepository,
} from '@/data/contracts/repos';
import { PgUser } from '@/infra/postgres/entities';

type LoadParams = LoadUserAccountRepository.Params;
type LoadResult = LoadUserAccountRepository.Result;
type SaveParams = SaveFacebookAccountRepository.Params;
type SaveResult = SaveFacebookAccountRepository.Result;

export class PgUserAccountRepository
  implements LoadUserAccountRepository, SaveFacebookAccountRepository
{
  private readonly pgUserRepo = getRepository(PgUser);

  async load({ email }: LoadParams): Promise<LoadResult> {
    const user = await this.pgUserRepo.findOne({
      email,
    });

    if (!user) return undefined;

    return {
      id: user.id.toString(),
      name: user.name ?? undefined,
    };
  }

  async saveWithFacebook(params: SaveParams): Promise<SaveResult> {
    const { email, facebook_id, name, id } = params;
    let resultId: string;

    if (!id) {
      const pgUser = await this.pgUserRepo.save({ email, name, facebook_id });

      resultId = pgUser.id.toString();
    } else {
      resultId = id;
      await this.pgUserRepo.update({ id: Number(id) }, { name, facebook_id });
    }

    return {
      id: resultId,
    };
  }
}
