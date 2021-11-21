export interface LoadUserAccountRepository {
  load: (
    params: LoadUserAccountRepository.Params,
  ) => Promise<LoadUserAccountRepository.Result>;
}

export namespace LoadUserAccountRepository {
  export type Params = {
    email: string;
  };

  export type Result = undefined;
}

export interface CreateFacebookAccountRepository {
  createFromFacebook: (
    params: CreateFacebookAccountRepository.Params,
  ) => Promise<CreateFacebookAccountRepository.Result>;
}

export namespace CreateFacebookAccountRepository {
  export type Params = {
    facebook_id: string;
    email: string;
    name: string;
  };

  export type Result = void;
}
