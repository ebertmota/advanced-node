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

  let id: string;
  let file: Buffer;

  beforeAll(() => {
    fileStorage = mock();
    fileStorage.upload.mockResolvedValue('any_url');
    uuidHandler = mock();
    userProfileRepo = mock();
    userProfileRepo.load.mockResolvedValue({ name: 'Ebert da Silva Mota' });
    uuid = 'any_uuid';
    uuidHandler.generate.mockReturnValue(uuid);
    id = 'any_id';
    file = Buffer.from('any_buffer');
  });

  beforeEach(() => {
    sut = setupChangeProfilePicture(fileStorage, uuidHandler, userProfileRepo);
  });

  it('should call UploadFile with correct input', async () => {
    await sut({ id, file });

    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: uuid });
    expect(fileStorage.upload).toHaveBeenCalledTimes(1);
  });

  it('should not call UploadFile when file is undefined', async () => {
    await sut({ id, file: undefined });

    expect(fileStorage.upload).not.toHaveBeenCalled();
  });

  it('should call SaveUserPicture with correct input', async () => {
    await sut({ id, file });

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith(
      mocked(UserProfile).mock.instances[0],
    );
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1);
  });

  it('should call LoadUserProfile with correct input', async () => {
    await sut({ id, file: undefined });

    expect(userProfileRepo.load).toHaveBeenCalledWith({
      id,
    });
    expect(userProfileRepo.load).toHaveBeenCalledTimes(1);
  });

  it('should not call LoadUserProfile if file is not undefined', async () => {
    await sut({ id, file });

    expect(userProfileRepo.load).not.toHaveBeenCalled();
  });

  it('should return correct data on success', async () => {
    mocked(UserProfile).mockImplementationOnce(() => ({
      setPicture: jest.fn(),
      id: 'any_id',
      picture_url: 'any_picture_url',
      initials: 'any_initials',
    }));

    const result = await sut({ id, file });

    expect(result).toMatchObject({
      picture_url: 'any_picture_url',
      initials: 'any_initials',
    });
  });
});
