import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';
import * as sgMail from '@sendgrid/mail';

jest.mock('@sendgrid/mail', () => {
  return {
    setApiKey: jest.fn(),
    send: jest.fn().mockResolvedValue([{ statusCode: 202 }]),
  };
});

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'SENDGRID_API_KEY') return 'test-api-key';
              if (key === 'SENDGRID_FROM_EMAIL') return 'test@example.com';
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(sgMail.setApiKey).toHaveBeenCalledWith('test-api-key');
  });

  it('should send standard email with string interpolation', async () => {
    await service.sendEmail({
      to: 'recipient@example.com',
      subject: 'Hello {{ name }}',
      body: 'Welcome to {{ place }}!',
      dynamicVars: { name: 'Alice', place: 'Wonderland' },
    });

    expect(sgMail.send).toHaveBeenCalledWith({
      to: 'recipient@example.com',
      from: 'test@example.com',
      subject: 'Hello Alice',
      html: 'Welcome to Wonderland!',
      text: 'Welcome to Wonderland!',
    });
  });

  it('should send email using SendGrid templateId', async () => {
    await service.sendEmail({
      to: 'recipient@example.com',
      templateId: 'd-12345',
      dynamicVars: { name: 'Bob' },
    });

    expect(sgMail.send).toHaveBeenCalledWith({
      to: 'recipient@example.com',
      from: 'test@example.com',
      templateId: 'd-12345',
      dynamicTemplateData: { name: 'Bob' },
    });
  });
});
