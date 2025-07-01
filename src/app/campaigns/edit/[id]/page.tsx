"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import dynamic from "next/dynamic";

const EmailEditor = dynamic(() => import("react-email-editor"), { ssr: false });

export default function EditCampaignPage() {
  const { id } = useParams();
  const router = useRouter();
  const emailEditorRef = useRef<any>(null);

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [design, setDesign] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaign = async () => {
      const res = await fetch(`/api/campaigns/${id}`);
      if (!res.ok) {
        alert("Failed to fetch campaign");
        return;
      }

      const data = await res.json();
      setTitle(data.title);
      setSubject(data.subject);
      setDesign(data.design || null); // Fallback for older campaigns
      setLoading(false);
    };

    if (id) fetchCampaign();
  }, [id]);

  // Load the design when the editor is ready
  const handleEditorLoad = () => {
    if (design && emailEditorRef.current) {
      emailEditorRef.current.editor.loadDesign(design);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    emailEditorRef.current?.editor.exportHtml(async ({ html, design }: { html: string; design: any }) => {
      const res = await fetch(`/api/campaigns/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, subject, body: html, design }),
      });

      if (res.ok) {
        alert("Campaign updated");
        router.push("/dashboard");
      } else {
        alert("Failed to update campaign");
      }
    });
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <main className="max-w-4xl mx-auto py-12 px-4 space-y-6">
      <h1 className="text-3xl font-bold">Edit Campaign</h1>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label>Email Editor</Label>
          <div className="h-[500px]">
            <EmailEditor ref={emailEditorRef} onLoad={handleEditorLoad} />
          </div>
        </div>

        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </main>
  );
}
