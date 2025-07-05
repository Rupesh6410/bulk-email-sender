import nodemailer from "nodemailer"
import { prisma } from "../lib/prisma"
import { decrypt } from "@/lib/crypto"

export async function sendUserEmail(
  userId: string,
  to: string,
  subject: string,
  html: string
) {
  const config = await prisma.smtpConfig.findUnique({ where: { userId } })
  if (!config) throw new Error("SMTP config not found")

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.username,
      pass: decrypt(config.password),
    },
  })

  return transporter.sendMail({
    from: config.username,
    to,
    subject,
    html,
  })
}
