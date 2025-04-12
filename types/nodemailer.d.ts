declare module "nodemailer" {
  export interface SendMailOptions {
    from?: string
    to?: string | string[]
    cc?: string | string[]
    bcc?: string | string[]
    subject?: string
    text?: string
    html?: string
    [key: string]: any
  }

  export interface Transporter {
    sendMail(mailOptions: SendMailOptions): Promise<any>
  }

  export function createTransport(options: any): Transporter
}
