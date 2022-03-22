import { UploadFile, UUIDGenerator } from '../contracts/gateways';
import { LoadUserProfile, SaveUserPicture } from '../contracts/repos';
import { UserProfile } from '../entities';

type Input = { id: string; file?: Buffer };
export type ChangeProfilePicture = (input: Input) => Promise<void>;
type Setup = (
  fileStorage: UploadFile,
  uuidHandler: UUIDGenerator,
  userProfileRepo: SaveUserPicture & LoadUserProfile,
) => ChangeProfilePicture;

export const setupChangeProfilePicture: Setup =
  (fileStorage, uuidHandler, userProfileRepo) =>
  async ({ id, file }) => {
    const data: { pictureUrl?: string; name?: string } = {};

    if (file) {
      data.pictureUrl = await fileStorage.upload({
        file,
        key: uuidHandler.generate({
          key: id,
        }),
      });
    } else {
      data.name = (await userProfileRepo.load({ id })).name;
    }
    const userProfile = new UserProfile(id);
    userProfile.setPicture(data);
    await userProfileRepo.savePicture(userProfile);
  };
