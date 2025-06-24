import { Injectable } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailBuilder } from './mail.builder';

@Injectable()
export class MailBuilderFactory {
  constructor(private readonly mailService: MailService) {}
  create() {
    return new MailBuilder(this.mailService);
  }
}
