"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Papa from "papaparse";

// Dynamically import react-email-editor for client-side only
const EmailEditor = dynamic(() => import("react-email-editor"), { ssr: false });

export default function CreateCampaignPage() {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [recipients, setRecipients] = useState<{ name?: string; email: string }[]>([]);
  const emailEditorRef = useRef<any>(null);
  const router = useRouter();

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const filtered = results.data.filter((r: any) => r.email); // Only include rows with email
        setRecipients(filtered as any);
      },
    });
  };

  const handleSubmit = async () => {
    if (!emailEditorRef.current) return;

    emailEditorRef.current.editor.exportHtml(async (data: any) => {
      const { html, design } = data;

      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          subject,
          body: html,
          design,
          recipients,
        }),
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        alert("Failed to create campaign");
      }
    });
  };

  return (
    <main className="max-w-4xl mx-auto py-12 px-4 space-y-6">
      <h1 className="text-3xl font-bold">Create New Campaign</h1>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Campaign Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Upload Recipients CSV</Label>
          <Input type="file" accept=".csv" onChange={handleCSVUpload} />
        </div>

        {recipients.length > 0 && (
          <div className="bg-muted p-4 rounded-md">
            <p className="font-medium">Recipients Loaded:</p>
            <ul className="text-sm max-h-32 overflow-y-auto list-disc list-inside">
              {recipients.map((r, i) => (
                <li key={i}>{r.name || "Unnamed"} ({r.email})</li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-2">
          <Label>Email Editor</Label>
          <div className="h-[500px]">
            <EmailEditor ref={emailEditorRef} />
          </div>
        </div>

        <Button onClick={handleSubmit}>Save Campaign</Button>
      </div>
    </main>
  );
}
