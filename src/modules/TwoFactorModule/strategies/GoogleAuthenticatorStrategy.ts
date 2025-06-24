import { Injectable } from '@nestjs/common';
import { User } from 'src/modules/users/user.entity';
import { TotpService } from '../totp.service';
import { TransportStrategy } from '../interfaces/TransportStrategy';
import { Setup2FAOutput } from 'src/modules/auth/dtos/setup2FAOutput.dto';

@Injectable()
export class GoogleAuthenticatorStrategy implements TransportStrategy {
  constructor(private readonly totpService: TotpService) {}

  async send(): Promise<void> {}

  async setUp(userId: number): Promise<Setup2FAOutput> {
    const secret = await this.totpService.generateSecret(userId);
    return {
      qrCodeUrl: await this.totpService.generateOtpAuthUrl(userId, secret),
      success: true,
    };
  }

  verify(user: User, code: string): boolean {
    return this.totpService.validateToken(user, code);
  }

  async generateSecret() {}
}
