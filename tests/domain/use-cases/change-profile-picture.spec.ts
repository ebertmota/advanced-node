/* eslint-disable @typescript-eslint/no-shadow */
import { mock } from 'jest-mock-extended';

type Input = { id: string; file: Buffer };
type ChangeProfilePicture = (input: Input) => Promise<void>;
type Setup = (fileStorage: UploadFile) => ChangeProfilePicture;

const setupChangeProfilePicture: Setup =
  fileStorage =>
  async ({ id, file }) => {
    await fileStorage.upload({
      file,
      key: id,
    });
  };

namespace UploadFile {
  export type Input = {
    file: Buffer;
    key: string;
  };
}

interface UploadFile {
  upload: (input: UploadFile.Input) => Promise<void>;
}

describe('ChangeProfilePicture', () => {
  let fileStorage: UploadFile;
  let sut: any;

  beforeAll(() => {
    fileStorage = mock();
  });

  beforeEach(() => {
    sut = setupChangeProfilePicture(fileStorage);
  });

  it('should call UploadFile with correct input', async () => {
    const file = Buffer.from('any_buffer');
    const id = 'any_id';
    await sut({ id, file });

    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: id });
    expect(fileStorage.upload).toHaveBeenCalledTimes(1);
  });
});
