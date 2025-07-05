"use client"

import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import type { SmtpConfigInput } from "@/types/smtp"

export default function SMTPSettingsPage() {
  const { register, handleSubmit } = useForm<SmtpConfigInput>()

  const onSubmit = async (data: SmtpConfigInput) => {
    console.log("Submitting SMTP config:", data); // ✅ check this in browser console
    const res = await fetch("/api/settings/smtp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    alert(res.ok ? "SMTP saved!" : "Failed to save SMTP")
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md p-4">
      <Input {...register("host")} placeholder="SMTP Host (e.g. smtp.mailgun.org)" />
      <Input {...register("port")} type="number" placeholder="SMTP Port" />
      <Input {...register("username")} placeholder="Email Address" />
      <Input {...register("password")} type="password" placeholder="App Password" />
      <div className="flex items-center space-x-2">
        <Checkbox {...register("secure")} />
        <label>Use Secure Connection (SSL)</label>
      </div>
      <Button type="submit">Save SMTP Settings</Button>
    </form>
  )
}
