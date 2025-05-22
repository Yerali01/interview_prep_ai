declare module "nodemailer" {
  interface Transporter {
    sendMail: (options: any) => Promise<any>;
  }

  function createTransport(options: any): Transporter;

  export = { createTransport };
}
