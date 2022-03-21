import { UploadFile, UUIDGenerator } from '../contracts/gateways';
import { LoadUserProfile, SaveUserPicture } from '../contracts/repos';

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
    let pictureUrl: string | undefined;
    let initials: string | undefined;

    if (file) {
      pictureUrl = await fileStorage.upload({
        file,
        key: uuidHandler.generate({
          key: id,
        }),
      });
    } else {
      const { name } = await userProfileRepo.load({ id });
      if (name) {
        const firstLetters = name.match(/\b(.)/g) ?? [];
        if (firstLetters.length > 1) {
          initials = `${firstLetters.shift()?.toUpperCase() ?? ''}${
            firstLetters.pop()?.toUpperCase() ?? ''
          }`;
        } else {
          initials = name.substring(0, 2).toUpperCase();
        }
      }
    }
    await userProfileRepo.savePicture({ pictureUrl, initials });
  };
