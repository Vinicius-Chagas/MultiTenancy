/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import Handlebars from 'handlebars';
import { join } from 'path';
import * as fs from 'fs';
import { createTransport } from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { EmailTemplate } from './types/mailTemplates';

@Injectable()
export class MailService {
  private readonly templateDir = join(process.cwd(), 'src/mails/templates');

  constructor(private configService: ConfigService) {
    const requiredVars = ['MAIL_HOST', 'MAIL_USER', 'MAIL_PASS', 'MAIL_PORT'];
    for (const envVar of requiredVars) {
      if (!this.configService.get(envVar)) {
        throw new Error(`Missing required email configuration: ${envVar}`);
      }
    }
  }

  async sendTemplatedEmail(options: {
    to: string;
    subject: string;
    template: EmailTemplate;
    context: Record<string, any>;
  }): Promise<void> {
    const { to, subject, template, context } = options;

    const html = await this.renderTemplate(template, context);
    await this.sendEmail(to, subject, html);
  }

  private async sendEmail(email: string, subject: string, html: string): Promise<void> {
    try {
      const transporter = createTransport({
        host: process.env.MAIL_HOST,
        service: process.env.MAIL_SERVICE,
        port: Number(process.env.MAIL_PORT),
        secure: true,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      await transporter.sendMail({
        from: process.env.MAIL_REPLY,
        to: email,
        subject,
        html,
      });

      console.log('email sent sucessfully');
    } catch (error) {
      console.error(`Email sending failed: ${error.message}`);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  private async renderTemplate(
    templateName: string,
    context: Record<string, any>,
  ): Promise<string> {
    const templatePath = this.findTemplatePath(templateName);

    const template = await fs.promises.readFile(templatePath, 'utf-8');
    const compiledTemplate = Handlebars.compile(template);

    return compiledTemplate(context);
  }

  private findTemplatePath(templateName: string) {
    const fullPath = join(this.templateDir, `${templateName}.html`);
    if (fs.existsSync(fullPath)) {
      return fullPath;
    }
    throw new Error(`Template not found: ${templateName}`);
  }
}
