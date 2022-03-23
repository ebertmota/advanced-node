import { UploadFile, UUIDGenerator } from '../contracts/gateways';
import { LoadUserProfile, SaveUserPicture } from '../contracts/repos';
import { UserProfile } from '../entities';

type Input = { id: string; file?: Buffer };
type Output = {
  picture_url?: string;
  initials?: string;
};
export type ChangeProfilePicture = (input: Input) => Promise<Output>;
type Setup = (
  fileStorage: UploadFile,
  uuidHandler: UUIDGenerator,
  userProfileRepo: SaveUserPicture & LoadUserProfile,
) => ChangeProfilePicture;

export const setupChangeProfilePicture: Setup =
  (fileStorage, uuidHandler, userProfileRepo) =>
  async ({ id, file }) => {
    const uploadFile = async (fileName: Buffer): Promise<string> => {
      return fileStorage.upload({
        file: fileName,
        key: uuidHandler.generate({
          key: id,
        }),
      });
    };

    const loadUserName = async (): Promise<string | undefined> => {
      const user = await userProfileRepo.load({ id });

      return user.name;
    };

    const data = {
      pictureUrl: file ? await uploadFile(file) : undefined,
      name: !file ? await loadUserName() : undefined,
    };

    const userProfile = new UserProfile(id);
    userProfile.setPicture(data);
    await userProfileRepo.savePicture(userProfile);

    return userProfile;
  };
