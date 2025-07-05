// /app/api/campaigns/route.ts - Handles GET (list campaigns) and POST (create campaign)
import { NextResponse } from "next/server";
import { auth } from "../../../../auth"
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  const session = await auth()
  const campaigns = await prisma.campaign.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      recipients: {
        select: {
          opened: true,
          clicked: true,
        },
      },
    },
  });

  // Add computed stats
  const enriched = campaigns.map(c => {
    const total = c.recipients.length;
    const opens = c.recipients.filter(r => r.opened).length;
    const clicks = c.recipients.filter(r => r.clicked).length;
    const openRate = total ? ((opens / total) * 100).toFixed(1) : "0.0";
    const clickRate = total ? ((clicks / total) * 100).toFixed(1) : "0.0";

    return {
      ...c,
      opens,
      clicks,
      total,
      openRate,
      clickRate,
    };
  });

  return NextResponse.json(enriched);
}


export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();
  const { title, subject, body, design, recipients } = data; // ✅ Include `design`

  try {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const campaign = await prisma.campaign.create({
      data: {
        title,
        subject,
        body,
        design, 
        status: "draft",
        userId: user.id,
        recipients: {
          create: recipients?.map((r: any) => ({
            email: r.email,
            name: r.name || "",
            status: "pending",
          })) ?? [],
        },
      },
    });

    return NextResponse.json({ success: true, campaign });
  } catch (error) {
    console.error("Campaign creation failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}