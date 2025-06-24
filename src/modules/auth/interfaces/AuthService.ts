import { CreateUserInput } from 'src/modules/users/dto/createUserInput.dto';
import { SignInInput } from '../dtos/signInInput.dto';
import { SignInOutput } from '../dtos/signInOutput.dto';

interface IAuthService {
  signIn(credentials: SignInInput): Promise<SignInOutput>;
  signUp(user: CreateUserInput): Promise<SignInOutput>;
  refreshToken(token: string): Promise<SignInOutput>;
  validateToken(token: string): Promise<{ isValid: boolean; error?: string }>;
  forgotPassword(email: string): Promise<string>;
  resetPassword(token: string, newPassword: string): Promise<string>;
}

export { IAuthService };
