"use client";

import { useEffect, useState } from "react";

// Define the shape of the campaign data
interface CampaignStats {
  id: string;
  title: string;
  subject: string;
  status: string;
  opens: number;
  clicks: number;
  total: number;
  openRate: string;
  clickRate: string;
}

export default function HistoryPage() {
  const [campaigns, setCampaigns] = useState<CampaignStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const res = await fetch("/api/campaigns");
        if (!res.ok) throw new Error("Failed to fetch campaigns");
        const data = await res.json();
        setCampaigns(data);
      } catch (err) {
        setError("Error loading campaign history.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCampaigns();
  }, []);

  return (
    <main className="max-w-5xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-3xl font-bold">Campaign History</h1>

      {loading ? (
        <p className="text-muted-foreground">Loading campaigns...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : campaigns.length === 0 ? (
        <p>No campaigns found.</p>
      ) : (
        <ul className="space-y-4">
          {campaigns.map((c) => (
            <li key={c.id} className="border rounded-md p-4 shadow-sm">
              <h2 className="text-xl font-semibold">{c.title}</h2>
              <p className="text-sm text-muted-foreground">Subject: {c.subject}</p>
              <p className="text-sm">Status: <span className="font-medium">{c.status}</span></p>
              <p className="text-sm">
                Open Rate: <strong>{c.openRate}%</strong> ({c.opens}/{c.total})
              </p>
              <p className="text-sm">
                Click Rate: <strong>{c.clickRate}%</strong> ({c.clicks}/{c.total})
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
