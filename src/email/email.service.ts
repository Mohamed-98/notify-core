import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sgMail from '@sendgrid/mail';

enum CircuitState {
  CLOSED,
  OPEN,
  HALF_OPEN,
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private circuitState = CircuitState.CLOSED;
  private failureCount = 0;
  private readonly failureThreshold = 3;
  private readonly resetTimeout = 30000;
  private lastFailureTime = 0;

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
    if (this.circuitState === CircuitState.OPEN) {
      if (Date.now() - this.lastFailureTime >= this.resetTimeout) {
        this.circuitState = CircuitState.HALF_OPEN;
        this.logger.warn('Circuit breaker half-open, attempting recovery');
      } else {
        this.logger.warn('Circuit breaker open, skipping email delivery');
        throw new Error('Email circuit breaker is open');
      }
    }

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
        text: finalBody.replace(/<[^>]*>/g, ''),
      };
    }

    try {
      await sgMail.send(msg);
      this.logger.log(`Email sent successfully to ${to}`);
      this.onSuccess();
    } catch (error: any) {
      this.logger.error(`Failed to send email to ${to}: ${error.message}`, error.stack);
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failureCount = 0;
    this.circuitState = CircuitState.CLOSED;
  }

  private onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    if (this.failureCount >= this.failureThreshold) {
      this.circuitState = CircuitState.OPEN;
      this.logger.error(`Circuit breaker opened after ${this.failureCount} failures`);
    }
  }
}
