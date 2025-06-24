import { Injectable } from '@nestjs/common';
import { Args, Mutation } from '@nestjs/graphql';
import { IsPublic } from 'src/shared/decorators/isPublic.decorator';
import { AuthService } from './services/auth.service';
import { SignInInput } from './dtos/signInInput.dto';
import { SignInOutput } from './dtos/signInOutput.dto';
import { ValidateTokenOutput } from './dtos/validateTokenOutput.dto';
import { ResetPasswordService } from './services/resetpassword.service';
import { TokenService } from './services/token.service';
import { twoFAInput } from '../TwoFactorModule/dtos/2FAInput.dto';

@Injectable()
@IsPublic()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly resetPasswordService: ResetPasswordService,
    private readonly tokenService: TokenService,
  ) {}

  @Mutation(() => SignInOutput)
  async signIn(
    @Args('credentials', { type: () => SignInInput }) credentials: SignInInput,
  ): Promise<SignInOutput> {
    return await this.authService.signIn(credentials);
  }

  @Mutation(() => SignInOutput)
  async signIn2FA(
    @Args('credentials', { type: () => twoFAInput }) credentials: twoFAInput,
  ): Promise<SignInOutput> {
    return await this.authService.verify2FA(credentials);
  }

  @Mutation(() => SignInOutput)
  async refreshToken(@Args('refresh_token') token: string): Promise<SignInOutput> {
    return await this.tokenService.refreshToken(token);
  }

  @Mutation(() => ValidateTokenOutput)
  async validateToken(@Args('token') token: string): Promise<ValidateTokenOutput> {
    return await this.tokenService.validateToken(token);
  }

  @Mutation(() => String)
  async forgotPassword(@Args('email') email: string): Promise<string> {
    return await this.resetPasswordService.forgotPassword(email);
  }

  @Mutation(() => ValidateTokenOutput)
  async validateForgotPasswordToken(@Args('token') token: string): Promise<ValidateTokenOutput> {
    return await this.resetPasswordService.validateToken(token);
  }

  @Mutation(() => String)
  async resetPassword(
    @Args('token') token: string,
    @Args('newPassword') newPassword: string,
  ): Promise<string> {
    return await this.resetPasswordService.resetPassword(token, newPassword);
  }
}
