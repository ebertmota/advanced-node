import { UserProfile } from '@/domain/entities';

describe('UserProfile', () => {
  let id: string;
  let pictureUrl: string;
  let sut: UserProfile;

  beforeAll(() => {
    id = 'any_id';
    pictureUrl = 'any_picture_urç';
  });

  beforeEach(() => {
    sut = new UserProfile(id);
  });

  it('should create with empty initials when pictureUrl and name is provided', () => {
    sut.setPicture({
      pictureUrl,
      name: 'any_name',
    });

    expect(sut).toEqual({
      id,
      pictureUrl,
      initials: undefined,
    });
  });

  it('should create with empty initials when pictureUrl is provided', () => {
    sut.setPicture({
      pictureUrl,
    });

    expect(sut).toEqual({
      id,
      pictureUrl,
      initials: undefined,
    });
  });

  it('should create initials with first letter of first and last names', () => {
    sut.setPicture({
      name: 'ebert oliveira mota',
    });

    expect(sut).toEqual({
      id,
      pictureUrl: undefined,
      initials: 'EM',
    });
  });

  it('should create initials with first two letter of first names', () => {
    sut.setPicture({
      name: 'ebert',
    });

    expect(sut).toEqual({
      id,
      pictureUrl: undefined,
      initials: 'EB',
    });
  });

  it('should create initials with first letter', () => {
    sut.setPicture({
      name: 'e',
    });

    expect(sut).toEqual({
      id,
      pictureUrl: undefined,
      initials: 'E',
    });
  });

  it('should create with empty initials when name and pictureUrl are not provided', () => {
    sut.setPicture({});

    expect(sut).toEqual({
      id,
      pictureUrl: undefined,
      initials: undefined,
    });
  });

  it('should create with empty initials and pictureUrl if name is empty', () => {
    sut.setPicture({ name: '' });

    expect(sut).toEqual({
      id,
      pictureUrl: undefined,
      initials: undefined,
    });
  });
});
