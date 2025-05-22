declare module "nodemailer" {
  export default {
   createTransport: function(options: any): {
     sendMail: (options: any) => Promise<any>
    }
 }
}
