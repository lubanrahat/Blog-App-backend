export interface MailgenContent {
  body: {
    name: string;
    intro: string;
    action?: {
      instructions: string;
      button: {
        color?: string;
        text: string;
        link: string;
      };
    };
    outro: string;
  };
}

export interface SendEmailOptions {
  email: string;
  subject: string;
  mailgenContent: MailgenContent;
}
