/* eslint-disable @typescript-eslint/no-shadow */
import { mock, MockProxy } from 'jest-mock-extended';

type Input = { id: string; file: Buffer };
type ChangeProfilePicture = (input: Input) => Promise<void>;
type Setup = (
  fileStorage: UploadFile,
  uuidHandler: UUIDGenerator,
) => ChangeProfilePicture;

const setupChangeProfilePicture: Setup =
  (fileStorage, uuidHandler) =>
  async ({ id, file }) => {
    await fileStorage.upload({
      file,
      key: uuidHandler.generate({
        key: id,
      }),
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

namespace UUIDGenerator {
  export type Input = {
    key: string;
  };

  export type Output = string;
}

interface UUIDGenerator {
  generate: (input: UUIDGenerator.Input) => UUIDGenerator.Output;
}

describe('ChangeProfilePicture', () => {
  let uuidHandler: MockProxy<UUIDGenerator>;
  let fileStorage: MockProxy<UploadFile>;
  let uuid: string;
  let sut: any;

  beforeAll(() => {
    fileStorage = mock();
    uuidHandler = mock();
    uuid = 'any_uuid';
    uuidHandler.generate.mockReturnValue(uuid);
  });

  beforeEach(() => {
    sut = setupChangeProfilePicture(fileStorage, uuidHandler);
  });

  it('should call UploadFile with correct input', async () => {
    const file = Buffer.from('any_buffer');
    const id = 'any_id';
    await sut({ id, file });

    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: uuid });
    expect(fileStorage.upload).toHaveBeenCalledTimes(1);
  });
});
