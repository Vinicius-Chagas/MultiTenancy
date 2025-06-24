import { InputType, PickType } from '@nestjs/graphql';
import { User } from '../user.entity';

@InputType()
export class definePasswordInput extends PickType(User, ['password', 'id'], InputType) {}
