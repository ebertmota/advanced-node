import { v4 } from 'uuid';
import { UUIDHandler } from '@/infra/crypto';

jest.mock('uuid');

describe('UUIDHandler', () => {
  let key: string;
  let sut: UUIDHandler;

  beforeAll(() => {
    key = 'any_key';
  });

  beforeEach(() => {
    sut = new UUIDHandler();
  });

  it('should call uuid.v4', () => {
    sut.generate({ key });

    expect(v4).toHaveBeenCalledTimes(1);
  });
});
