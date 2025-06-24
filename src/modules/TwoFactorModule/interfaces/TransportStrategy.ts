import { Setup2FAOutput } from 'src/modules/auth/dtos/setup2FAOutput.dto';
import { User } from 'src/modules/users/user.entity';

interface TwoFactorSetup {
  generateSecret(user: User): Promise<void>;
  setUp(userId: number): Promise<Setup2FAOutput>;
}

interface TwoFactorVerification {
  verify(user: User, code: string): boolean;
}

interface TwoFactorTransport {
  send(user: User): Promise<void>;
}

interface TransportStrategy extends TwoFactorSetup, TwoFactorTransport, TwoFactorVerification {}

export { TwoFactorSetup, TwoFactorTransport, TwoFactorVerification, TransportStrategy };
