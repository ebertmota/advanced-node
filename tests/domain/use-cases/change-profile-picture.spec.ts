/* eslint-disable @typescript-eslint/no-shadow */
import { mock, MockProxy } from 'jest-mock-extended';
import {
  ChangeProfilePicture,
  setupChangeProfilePicture,
} from '@/domain/use-cases';
import { UploadFile, UUIDGenerator } from '@/domain/contracts/gateways';

describe('ChangeProfilePicture', () => {
  let uuidHandler: MockProxy<UUIDGenerator>;
  let fileStorage: MockProxy<UploadFile>;
  let uuid: string;
  let sut: ChangeProfilePicture;

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
