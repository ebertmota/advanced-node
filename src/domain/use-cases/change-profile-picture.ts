import { UploadFile, UUIDGenerator } from '../contracts/gateways';
import { SaveUserPicture } from '../contracts/repos';

type Input = { id: string; file?: Buffer };
export type ChangeProfilePicture = (input: Input) => Promise<void>;
type Setup = (
  fileStorage: UploadFile,
  uuidHandler: UUIDGenerator,
  userProfileRepo: SaveUserPicture,
) => ChangeProfilePicture;

export const setupChangeProfilePicture: Setup =
  (fileStorage, uuidHandler, userProfileRepo) =>
  async ({ id, file }) => {
    let pictureUrl: string | undefined;

    if (file) {
      pictureUrl = await fileStorage.upload({
        file,
        key: uuidHandler.generate({
          key: id,
        }),
      });
    }
    await userProfileRepo.savePicture({ pictureUrl });
  };
