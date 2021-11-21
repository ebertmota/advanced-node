export interface LoadUserAccountRepository {
  load: (
    params: LoadUserAccountRepository.Params,
  ) => Promise<LoadUserAccountRepository.Result>;
}

export namespace LoadUserAccountRepository {
  export type Params = {
    email: string;
  };

  export type Result =
    | undefined
    | {
        id: string;
        name?: string;
      };
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

export interface UpdateFacebookAccountRepository {
  updateWithFacebook: (
    params: UpdateFacebookAccountRepository.Params,
  ) => Promise<CreateFacebookAccountRepository.Result>;
}

export namespace UpdateFacebookAccountRepository {
  export type Params = {
    id: string;
    name: string;
    facebook_id: string;
  };

  export type Result = void;
}
