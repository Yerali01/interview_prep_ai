"use server"

import nodemailer from "nodemailer"

// Create a transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "your-email@gmail.com",
    pass: process.env.EMAIL_PASSWORD || "your-password",
  },
})

export async function sendFeedbackEmail(data: {
  name: string
  email: string
  message: string
  rating: number
}) {
  try {
    const { name, email, message, rating } = data

    // Email content
    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.EMAIL_USER || "your-email@gmail.com",
      to: process.env.EMAIL_USER || "your-email@gmail.com",
      subject: `Flutter Interview Prep Feedback - Rating: ${rating}/5`,
      html: `
        <h1>New Feedback Submission</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Rating:</strong> ${rating}/5</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    }

    // Send email
    await transporter.sendMail(mailOptions)
    return { success: true, message: "Feedback sent successfully!" }
  } catch (error) {
    console.error("Error sending email:", error)
    return { success: false, message: "Failed to send feedback. Please try again later." }
  }
}
