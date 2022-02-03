import {
  RequiredStringValidator,
  ValidationBuilder,
} from '@/application/validation';

describe('ValidationBuilder', () => {
  it('should return a RequiredStringValidator', () => {
    const validators = ValidationBuilder.of({
      value: 'any_value',
      fieldName: 'any_fieldName',
    })
      .required()
      .build();

    expect(validators).toEqual([
      new RequiredStringValidator('any_value', 'any_fieldName'),
    ]);
  });
});
