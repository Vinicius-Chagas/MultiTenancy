import { Injectable } from '@nestjs/common';
import { GoogleAuthenticatorStrategy } from './strategies/GoogleAuthenticatorStrategy';
import { TransportStrategy } from './interfaces/TransportStrategy';

@Injectable()
export class TransportStrategyBuilder {
  constructor(private readonly googleAuthenticatorStrategy: GoogleAuthenticatorStrategy) {}

  build(
    strategyName: 'googleAuthenticator' | 'email' | 'sms' = 'googleAuthenticator',
  ): TransportStrategy {
    switch (strategyName) {
      case 'googleAuthenticator':
        return this.googleAuthenticatorStrategy;
      default:
        throw new Error(`Unknown strategy: ${strategyName}`);
    }
  }
}
