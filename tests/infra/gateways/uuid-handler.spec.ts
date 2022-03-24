import { v4 } from 'uuid';
import { mocked } from 'ts-jest/utils';
import { UUIDHandler } from '@/infra/gateways';

jest.mock('uuid');

describe('UUIDHandler', () => {
  let key: string;
  let sut: UUIDHandler;
  let uuid: string;

  beforeAll(() => {
    key = 'any_key';
    uuid = 'any_uuid';
    mocked(v4).mockReturnValue(uuid);
  });

  beforeEach(() => {
    sut = new UUIDHandler();
  });

  it('should call uuid.v4', () => {
    sut.generate({ key });

    expect(v4).toHaveBeenCalledTimes(1);
  });

  it('should return correct uuid', () => {
    const result = sut.generate({ key });

    expect(result).toEqual(`${key}_${uuid}`);
  });
});
