/* eslint-disable @typescript-eslint/no-shadow */
import { mock, MockProxy } from 'jest-mock-extended';
import { mocked } from 'ts-jest/utils';
import {
  ChangeProfilePicture,
  setupChangeProfilePicture,
} from '@/domain/use-cases';
import { UploadFile, UUIDGenerator } from '@/domain/contracts/gateways';
import { SaveUserPicture, LoadUserProfile } from '@/domain/contracts/repos';
import { UserProfile } from '@/domain/entities';

jest.mock('@/domain/entities/user-profile');

describe('ChangeProfilePicture', () => {
  let uuidHandler: MockProxy<UUIDGenerator>;
  let fileStorage: MockProxy<UploadFile>;
  let userProfileRepo: MockProxy<SaveUserPicture & LoadUserProfile>;
  let uuid: string;
  let sut: ChangeProfilePicture;

  beforeAll(() => {
    fileStorage = mock();
    fileStorage.upload.mockResolvedValue('any_url');
    uuidHandler = mock();
    userProfileRepo = mock();
    userProfileRepo.load.mockResolvedValue({ name: 'Ebert da Silva Mota' });
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

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith(
      mocked(UserProfile).mock.instances[0],
    );
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1);
  });

  it('should call LoadUserProfile with correct input', async () => {
    const id = 'any_id';
    await sut({ id, file: undefined });

    expect(userProfileRepo.load).toHaveBeenCalledWith({
      id: 'any_id',
    });
    expect(userProfileRepo.load).toHaveBeenCalledTimes(1);
  });

  it('should not call LoadUserProfile if file is not undefined', async () => {
    await sut({ id: 'any_id', file: Buffer.from('any_buffer') });

    expect(userProfileRepo.load).not.toHaveBeenCalled();
  });
});
