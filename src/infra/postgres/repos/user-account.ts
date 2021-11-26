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

export class PgUserAccountRepository implements LoadUserAccountRepository {
  private readonly pgUserRepo = getRepository(PgUser);

  async load(params: LoadParams): Promise<LoadResult> {
    const user = await this.pgUserRepo.findOne({
      email: params.email,
    });

    if (!user) return undefined;

    return {
      id: user.id.toString(),
      name: user.name ?? undefined,
    };
  }

  async saveWithFacebook(params: SaveParams): Promise<SaveResult> {
    let id: string;

    if (!params.id) {
      const pgUser = await this.pgUserRepo.save({
        email: params.email,
        name: params.name,
        facebook_id: params.facebook_id,
      });

      id = pgUser.id.toString();
    } else {
      id = params.id;
      await this.pgUserRepo.update(
        {
          id: Number(params.id),
        },
        {
          name: params.name,
          facebook_id: params.facebook_id,
        },
      );
    }

    return {
      id,
    };
  }
}
