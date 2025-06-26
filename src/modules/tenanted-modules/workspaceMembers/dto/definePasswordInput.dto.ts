import { InputType, PickType } from '@nestjs/graphql';
import { User } from '../workspaceMember';

@InputType()
export class definePasswordInput extends PickType(User, ['password', 'id'], InputType) {}
