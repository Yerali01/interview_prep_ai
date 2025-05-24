// Override Next.js types to avoid conflicts
declare namespace NextJS {
  interface PageProps {
    params?: any
    searchParams?: any
  }
}

// Declare module for nodemailer to avoid type errors
declare module "nodemailer" {
  const createTransport: any
  export default { createTransport }
}
