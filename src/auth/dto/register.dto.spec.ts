import { validate } from 'class-validator';
import { RegisterDto } from './register.dto.js';
import { BloodGroupCode } from '../../donors/schemas/donor.schema.js';

describe('RegisterDto', () => {
  const baseDto = {
    name: 'Taher Itawa',
    email: 'taher@example.com',
    password: '123456',
  };

  it('allows registration without donor details when isDonor is false', async () => {
    const errors = await validate(
      Object.assign(new RegisterDto(), {
        ...baseDto,
        isDonor: false,
      }),
    );

    expect(errors).toHaveLength(0);
  });

  it('requires donor profile details when isDonor is true', async () => {
    const errors = await validate(
      Object.assign(new RegisterDto(), {
        ...baseDto,
        isDonor: true,
      }),
    );

    expect(errors.map(({ property }) => property)).toEqual(
      expect.arrayContaining(['bloodGroup', 'city']),
    );
  });

  it('accepts a complete donor registration', async () => {
    const errors = await validate(
      Object.assign(new RegisterDto(), {
        ...baseDto,
        isDonor: true,
        bloodGroup: BloodGroupCode.O_POSITIVE,
        city: 'Jaipur',
      }),
    );

    expect(errors).toHaveLength(0);
  });

  it('rejects blood group labels instead of numeric codes', async () => {
    const errors = await validate(
      Object.assign(new RegisterDto(), {
        ...baseDto,
        isDonor: true,
        bloodGroup: 'O+',
        city: 'Jaipur',
      }),
    );

    expect(errors.map(({ property }) => property)).toContain('bloodGroup');
  });

  it('requires isDonor to be a boolean', async () => {
    const errors = await validate(Object.assign(new RegisterDto(), baseDto));

    expect(errors.map(({ property }) => property)).toContain('isDonor');
  });
});
