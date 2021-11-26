import { getRepository } from 'typeorm';

import {
  LoadUserAccountRepository,
  SaveFacebookAccountRepository,
} from '@/data/contracts/repos';
import { PgUser } from '@/infra/postgres/entities';

export class PgUserAccountRepository implements LoadUserAccountRepository {
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

  async saveWithFacebook(
    params: SaveFacebookAccountRepository.Params,
  ): Promise<void> {
    const pgUserRepo = getRepository(PgUser);

    if (!params.id) {
      await pgUserRepo.save({
        email: params.email,
        name: params.name,
        facebook_id: params.facebook_id,
      });
    } else {
      await pgUserRepo.update(
        {
          id: Number(params.id),
        },
        {
          name: params.name,
          facebook_id: params.facebook_id,
        },
      );
    }
  }
}
