import { UploadFile, UUIDGenerator } from '../contracts/gateways';

type Input = { id: string; file: Buffer };
export type ChangeProfilePicture = (input: Input) => Promise<void>;
type Setup = (
  fileStorage: UploadFile,
  uuidHandler: UUIDGenerator,
) => ChangeProfilePicture;

export const setupChangeProfilePicture: Setup =
  (fileStorage, uuidHandler) =>
  async ({ id, file }) => {
    await fileStorage.upload({
      file,
      key: uuidHandler.generate({
        key: id,
      }),
    });
  };
