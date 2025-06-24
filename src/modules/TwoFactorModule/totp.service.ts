import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { BaseRepository } from 'src/database/base-repository';
import { User } from 'src/modules/users/user.entity';
import { CustomErrors } from 'src/shared/errors/customErrors';
import { EncriptionService } from './encription.service';

@Injectable()
export class TotpService {
  private errorHandler = new CustomErrors('totpService');

  constructor(
    @InjectRepository(User) private usersRepository: BaseRepository<User>,
    private encriptionService: EncriptionService,
  ) {
    authenticator.options = { window: 1 };
  }

  async generateSecret(userId: number): Promise<string> {
    const exception = new InternalServerErrorException('Falha ao inicializar 2FA');
    return this.errorHandler.handleServiceMethod(
      async () => {
        const secret = authenticator.generateSecret();
        const encripted = this.encriptionService.encrypt(secret);

        await this.usersRepository.update(userId, { twoFASecret: encripted, twoFa: true });

        return secret;
      },
      'custom',
      undefined,
      exception,
    );
  }

  async generateOtpAuthUrl(userId: number, secret: string): Promise<string> {
    console.log('secret', secret);
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      select: { email: true },
    });
    const optAuthUrl = authenticator.keyuri(user?.email as string, 'Chat Mix', secret);
    return await toDataURL(optAuthUrl);
  }

  validateToken(user: User, token: string): boolean {
    if (!user.twoFASecret) {
      throw new BadRequestException('2FA is not set up for this user.');
    }
    const decryptedSecret = this.encriptionService.decrypt(user.twoFASecret);
    return authenticator.check(token, decryptedSecret);
  }

  generateCode(secret: string): string {
    return authenticator.generate(secret);
  }
}
