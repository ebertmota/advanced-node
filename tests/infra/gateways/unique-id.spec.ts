import { UniqueId } from '@/infra/gateways';

describe('UniqueId', () => {
  let key: string;
  let sut: UniqueId;

  beforeAll(() => {
    key = 'any_key';
  });

  beforeEach(() => {
    sut = new UniqueId();
  });

  it('should call return correct uuid', () => {
    const currentDate = new Date(2021, 2, 3, 10, 10, 10);
    jest.useFakeTimers().setSystemTime(currentDate);

    const result = sut.generate({ key });

    expect(result).toEqual(`${key}_20210303101010`);
  });

  it('should call return correct uuid', () => {
    const currentDate = new Date(2018, 2, 10, 18, 1, 0);
    jest.useFakeTimers().setSystemTime(currentDate);

    const result = sut.generate({ key });

    expect(result).toEqual(`${key}_20180310180100`);
  });
});
