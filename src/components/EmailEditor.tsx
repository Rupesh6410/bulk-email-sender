"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

// Dynamically import to avoid SSR issues
const EmailEditor = dynamic(() => import("react-email-editor"), {
  ssr: false,
});

export default function EmailEditorComponent() {
  const emailEditorRef = useRef<any>(null);

  const exportHtml = () => {
    if (emailEditorRef.current) {
      emailEditorRef.current.editor.exportHtml((data: any) => {
        const { html } = data;
        console.log("exported HTML:", html);
        // Save this HTML to DB or use it in your campaign
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="h-[600px] border rounded overflow-hidden">
        <EmailEditor ref={emailEditorRef} />
      </div>
      <Button onClick={exportHtml}>Export HTML</Button>
    </div>
  );
}
