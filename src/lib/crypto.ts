import crypto from "crypto"

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!
const IV_LENGTH = 16

export function encrypt(text: string) {
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv)
  let encrypted = cipher.update(text)
  encrypted = Buffer.concat([encrypted, cipher.final()])
  return iv.toString("hex") + ":" + encrypted.toString("hex")
}

export function decrypt(text: string) {
  const [ivStr, encStr] = text.split(":")
  const iv = Buffer.from(ivStr, "hex")
  const encryptedText = Buffer.from(encStr, "hex")
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv)
  let decrypted = decipher.update(encryptedText)
  decrypted = Buffer.concat([decrypted, decipher.final()])
  return decrypted.toString()
}
