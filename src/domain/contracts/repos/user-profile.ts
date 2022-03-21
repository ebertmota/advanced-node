export namespace SaveUserPicture {
  export type Input = {
    pictureUrl?: string;
  };
}

export interface SaveUserPicture {
  savePicture: (params: SaveUserPicture.Input) => Promise<void>;
}

export namespace LoadUserProfile {
  export type Input = {
    id: string;
  };
}

export interface LoadUserProfile {
  load: (params: LoadUserProfile.Input) => Promise<void>;
}
