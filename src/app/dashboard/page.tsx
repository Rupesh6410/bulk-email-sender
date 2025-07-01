"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/campaigns");
      const data = await res.json();
      setCampaigns(data);
    } catch (err) {
      console.error("Failed to fetch campaigns", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const sendCampaign = async (id: string) => {
    const res = await fetch(`/api/campaigns/${id}/send`, { method: "POST" });
    if (res.ok) {
      alert("Campaign sent!");
      fetchCampaigns();
    } else {
      const error = await res.json();
      alert("Failed to send: " + error.error);
    }
  };

  const deleteCampaign = async (id: string) => {
    const confirm = window.confirm("Are you sure you want to delete this campaign?");
    if (!confirm) return;

    const res = await fetch(`/api/campaigns/${id}`, { method: "DELETE" });
    if (res.ok) {
      alert("Deleted");
      fetchCampaigns();
    } else {
      const error = await res.json();
      alert("Delete failed: " + error.error);
    }
  };

  const editCampaign = (id: string) => {
    router.push(`/campaigns/edit/${id}`);
  };

  return (
    <main className="max-w-5xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-3xl font-bold">Your Campaigns</h1>

      {loading ? (
        <p className="text-muted-foreground animate-pulse"><Loader2 className="animate-spin"/></p>
      ) : campaigns.length === 0 ? (
        <p className="text-muted-foreground">No campaigns created yet.</p>
      ) : (
        <ul className="space-y-4">
          {campaigns.map((c: any) => (
            <li key={c.id} className="border rounded-md p-4">
              <h2 className="text-xl font-semibold">{c.title}</h2>
              <p className="text-sm text-muted-foreground">Subject: {c.subject}</p>
              <p className="text-sm text-muted-foreground">Status: {c.status}</p>

              <div className="mt-4 flex gap-2 flex-wrap">
  {c.status === "draft" ? (
    <>
      <Button onClick={() => sendCampaign(c.id)}>Send</Button>
      <Button variant="secondary" onClick={() => editCampaign(c.id)}>
        Edit
      </Button>
      <Button variant="destructive" onClick={() => deleteCampaign(c.id)}>
        Delete
      </Button>
    </>
  ) : (
    <p className="text-green-600 text-sm font-medium">Already Sent</p>
  )}
</div>

            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
