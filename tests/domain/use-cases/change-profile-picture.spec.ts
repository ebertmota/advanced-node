/* eslint-disable @typescript-eslint/no-shadow */
import { mock, MockProxy } from 'jest-mock-extended';
import {
  ChangeProfilePicture,
  setupChangeProfilePicture,
} from '@/domain/use-cases';
import { UploadFile, UUIDGenerator } from '@/domain/contracts/gateways';
import { SaveUserPicture } from '@/domain/contracts/repos';

describe('ChangeProfilePicture', () => {
  let uuidHandler: MockProxy<UUIDGenerator>;
  let fileStorage: MockProxy<UploadFile>;
  let userProfileRepo: MockProxy<SaveUserPicture>;
  let uuid: string;
  let sut: ChangeProfilePicture;

  beforeAll(() => {
    fileStorage = mock();
    fileStorage.upload.mockResolvedValue('any_url');
    uuidHandler = mock();
    userProfileRepo = mock();
    uuid = 'any_uuid';
    uuidHandler.generate.mockReturnValue(uuid);
  });

  beforeEach(() => {
    sut = setupChangeProfilePicture(fileStorage, uuidHandler, userProfileRepo);
  });

  it('should call UploadFile with correct input', async () => {
    const file = Buffer.from('any_buffer');
    const id = 'any_id';
    await sut({ id, file });

    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: uuid });
    expect(fileStorage.upload).toHaveBeenCalledTimes(1);
  });

  it('should not call UploadFile when file is undefined', async () => {
    const id = 'any_id';
    await sut({ id, file: undefined });

    expect(fileStorage.upload).not.toHaveBeenCalled();
  });

  it('should call SaveUserPicture with correct input', async () => {
    const file = Buffer.from('any_buffer');
    const id = 'any_id';
    await sut({ id, file });

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith({
      pictureUrl: 'any_url',
      initials: undefined,
    });
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1);
  });

  it('should call SaveUserPicture with correct input when file is undefined', async () => {
    const id = 'any_id';
    await sut({ id, file: undefined });

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith({
      pictureUrl: undefined,
    });
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1);
  });
});
