import { MailBuilderFactory } from './mail.factory';
import { MailService } from './mail.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [],
  providers: [MailService, MailBuilderFactory],
  exports: [MailService, MailBuilderFactory],
})
export class MailModule {}
