import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function GET(req: NextRequest) {
  const campaignId = req.nextUrl.searchParams.get("cid");
  const recipientId = req.nextUrl.searchParams.get("rid");

  if (!campaignId || !recipientId) {
    return new NextResponse("Missing parameters", { status: 400 });
  }

  try {
    // Mark as opened
    await prisma.recipient.update({
      where: { id: recipientId },
      data: { opened: true },
    });

    // Transparent 1x1 pixel PNG (base64)
    const imageBuffer = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBg3vboUQAAAAASUVORK5CYII=",
      "base64"
    );

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Length": imageBuffer.length.toString(),
        "Cache-Control": "no-cache", // ✅ prevent image from being cached
      },
    });
  } catch (err) {
    console.error("Open tracking failed", err);
    return new NextResponse("Server error", { status: 500 });
  }
}
