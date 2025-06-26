import { Module } from '@nestjs/common';
import { TotpService } from './totp.service';
import { TransportStrategyBuilder } from './TransportStrategyBuilder';
import { GoogleAuthenticatorStrategy } from './strategies/GoogleAuthenticatorStrategy';
import { RepositoryInjectionProvider } from 'src/utils/RepositoryInjectionProvider';
import { User } from '../users/user.entity';
import { EncriptionService } from './encription.service';

@Module({
  providers: [
    EncriptionService,
    TransportStrategyBuilder,
    GoogleAuthenticatorStrategy,
    TotpService,
    RepositoryInjectionProvider(User),
  ],
  exports: [TransportStrategyBuilder, TotpService],
})
export class TwoFactorModule {}
