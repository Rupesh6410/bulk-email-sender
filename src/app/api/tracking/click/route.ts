// /app/api/tracking/click/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const campaignId = searchParams.get("cid");
  const recipientId = searchParams.get("rid");
  const targetUrl = searchParams.get("url");

  if (!campaignId || !recipientId || !targetUrl) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    await prisma.recipient.update({
      where: { id: recipientId },
      data: { clicked: true },
    });

    if (process.env.NODE_ENV === "development") {
      console.log("Click tracked:", { campaignId, recipientId, targetUrl });
    }

    const decodedUrl = decodeURIComponent(targetUrl);
    return NextResponse.redirect(decodedUrl, 302);
  } catch (error) {
    console.error("Click tracking error:", error);
    return NextResponse.json({ error: "Click tracking failed" }, { status: 500 });
  }
}

