import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sgMail from '@sendgrid/mail';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('SENDGRID_API_KEY') || '';
    sgMail.setApiKey(apiKey);
  }

  async sendEmail(options: {
    to: string;
    subject?: string;
    body?: string;
    templateId?: string;
    dynamicVars?: Record<string, any>;
  }): Promise<void> {
    const from = this.configService.get<string>('SENDGRID_FROM_EMAIL') || 'no-reply@example.com';
    const { to, subject, body, templateId, dynamicVars } = options;

    let msg: sgMail.MailDataRequired;

    if (templateId) {
      msg = {
        to,
        from,
        templateId,
        dynamicTemplateData: dynamicVars,
      };
    } else {
      let finalSubject = subject || '';
      let finalBody = body || '';

      if (dynamicVars) {
        const interpolate = (text: string, vars: Record<string, any>) =>
          text.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => (vars[key] !== undefined ? String(vars[key]) : `{{${key}}}`));
        
        finalSubject = interpolate(finalSubject, dynamicVars);
        finalBody = interpolate(finalBody, dynamicVars);
      }

      msg = {
        to,
        from,
        subject: finalSubject,
        html: finalBody,
        text: finalBody.replace(/<[^>]*>/g, ''), // Basic HTML strip for text fallback
      };
    }

    try {
      await sgMail.send(msg);
      this.logger.log(`Email sent successfully to ${to}`);
    } catch (error: any) {
      this.logger.error(`Failed to send email to ${to}: ${error.message}`, error.stack);
      throw error;
    }
  }
}
