import { MailService } from './mail.service';
import { EmailTemplate } from './types/mailTemplates';

export class MailBuilder {
  private to: string;
  private subject: string;
  private template: EmailTemplate;
  private context: Record<string, any>;

  constructor(private mailService: MailService) {}

  setRecipient(email: string): MailBuilder {
    this.to = email;
    return this;
  }

  setSubject(subject: string): MailBuilder {
    this.subject = subject;
    return this;
  }

  setTemplate(template: EmailTemplate): MailBuilder {
    this.template = template;
    return this;
  }

  setContext(context: Record<string, any>): MailBuilder {
    this.context = context;
    return this;
  }

  private build(): {
    to: string;
    subject: string;
    template: EmailTemplate;
    context: Record<string, any>;
  } {
    if (!this.to || !this.subject || !this.template || !this.context) {
      throw new Error('Missing required fields to build the email.');
    }
    return {
      to: this.to,
      subject: this.subject,
      template: this.template,
      context: this.context,
    };
  }

  send(): Promise<void> {
    const emailData = this.build();
    return this.mailService.sendTemplatedEmail(emailData);
  }
}
