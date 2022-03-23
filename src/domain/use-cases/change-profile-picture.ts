import { DeleteFile, UploadFile, UUIDGenerator } from '../contracts/gateways';
import { LoadUserProfile, SaveUserPicture } from '../contracts/repos';
import { UserProfile } from '../entities';

type Input = { id: string; file?: Buffer };
type Output = {
  picture_url?: string;
  initials?: string;
};
export type ChangeProfilePicture = (input: Input) => Promise<Output>;
type Setup = (
  fileStorage: UploadFile & DeleteFile,
  uuidHandler: UUIDGenerator,
  userProfileRepo: SaveUserPicture & LoadUserProfile,
) => ChangeProfilePicture;

export const setupChangeProfilePicture: Setup =
  (fileStorage, uuidHandler, userProfileRepo) =>
  async ({ id, file }) => {
    const key = uuidHandler.generate({
      key: id,
    });

    const uploadFile = async (fileName: Buffer): Promise<string> => {
      return fileStorage.upload({
        file: fileName,
        key,
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

    try {
      await userProfileRepo.savePicture(userProfile);
    } catch {
      if (file) {
        await fileStorage.delete({
          key,
        });
      }
    }

    return userProfile;
  };
