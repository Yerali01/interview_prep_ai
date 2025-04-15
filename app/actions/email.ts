"use server"

import nodemailer from "nodemailer"

// Create a transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    // Using application password for Gmail
    user: "eraliflash@gmail.com",
    pass: process.env.EMAIL_PASSWORD || "your-app-password-here",
  },
})

export async function sendFeedback(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const message = formData.get("message") as string

  if (!name || !email || !message) {
    return { success: false, error: "All fields are required" }
  }

  try {
    await transporter.sendMail({
      from: `"Flutter Interview Prep" <eraliflash@gmail.com>`,
      to: "eraliflash@gmail.com",
      subject: `Feedback from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <h2>New Feedback Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <h3>Message:</h3>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
      replyTo: email,
    })

    return { success: true }
  } catch (error) {
    console.error("Error sending email:", error)
    return { success: false, error: "Failed to send email" }
  }
}
