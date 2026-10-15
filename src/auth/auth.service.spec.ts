import { AuthService } from './auth.service.js';
import { UserRole } from '../users/enums/role.enum.js';
import {
  BLOOD_GROUP_BY_CODE,
  BloodGroupCode,
} from '../donors/schemas/donor.schema.js';

describe('AuthService registration', () => {
  const usersService = {
    findByEmail: vi.fn(),
    create: vi.fn(),
  };
  const donorsService = {
    create: vi.fn(),
  };
  const jwtService = {
    signAsync: vi.fn(),
  };
  const authService = new AuthService(
    usersService as never,
    donorsService as never,
    jwtService as never,
  );

  beforeEach(() => {
    vi.clearAllMocks();
    usersService.findByEmail.mockResolvedValue(null);
    usersService.create.mockResolvedValue({
      _id: { toString: () => 'user-id' },
      name: 'Taher Itawa',
      email: 'taher@example.com',
      role: UserRole.SEEKER,
      isDonor: false,
    });
    donorsService.create.mockResolvedValue({ _id: 'donor-id' });
  });

  it('registers a seeker without creating a donor profile', async () => {
    await authService.register({
      name: 'Taher Itawa',
      email: 'taher@example.com',
      password: '123456',
      isDonor: false,
    });

    expect(usersService.create).toHaveBeenCalledWith(
      expect.objectContaining({
        role: UserRole.SEEKER,
        isDonor: false,
      }),
    );
    expect(donorsService.create).not.toHaveBeenCalled();
  });

  it('creates a donor profile during donor registration', async () => {
    usersService.create.mockResolvedValue({
      _id: { toString: () => 'user-id' },
      name: 'Taher Itawa',
      email: 'taher@example.com',
      role: UserRole.DONOR,
      isDonor: true,
    });

    await authService.register({
      name: 'Taher Itawa',
      email: 'taher@example.com',
      password: '123456',
      isDonor: true,
      bloodGroup: BloodGroupCode.O_POSITIVE,
      city: 'Jaipur',
    });

    expect(usersService.create).toHaveBeenCalledWith(
      expect.objectContaining({
        role: UserRole.DONOR,
        isDonor: true,
      }),
    );
    expect(donorsService.create).toHaveBeenCalledWith('user-id', {
      bloodGroup: BLOOD_GROUP_BY_CODE[BloodGroupCode.O_POSITIVE],
      city: 'Jaipur',
      phone: undefined,
      address: undefined,
    });
  });
});
