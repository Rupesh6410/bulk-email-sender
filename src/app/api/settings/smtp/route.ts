import { validateSmtpInput } from "@/types/smtp"
import { prisma } from "../../../../../lib/prisma"
import { encrypt } from "@/lib/crypto"
import { auth } from "../../../../../auth"
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) return new Response("Unauthorized", { status: 401 })

    const body = await req.json()

    const safeBody = {
      ...body,
      port: Number(body.port),
      secure: body.secure === true || body.secure === "on" || body.secure === "true",
    }

    if (!validateSmtpInput(safeBody)) {
      return new Response("Invalid input", { status: 400 })
    }

    const { password, ...rest } = safeBody
    const encryptedPassword = encrypt(password)

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) return new Response("User not found", { status: 404 })

    await prisma.smtpConfig.upsert({
      where: { userId: user.id },
      update: { ...rest, password: encryptedPassword },
      create: { ...rest, password: encryptedPassword, userId: user.id },
    })

    return new Response("SMTP Config Saved")
  } catch (error) {
    console.error("SMTP API Error:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}