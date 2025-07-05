// File: src/app/api/campaigns/[id]/route.ts

import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma"; // adjust if you're not using @ alias
import { auth } from "../../../../../auth";

// ✅ GET: Fetch campaign by ID
export async function GET(
  req: Request,
  // Corrected type for context.params
  context: { params: { id: string } }
) {
  const id = context.params.id;

  if (!id) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: { recipients: true },
    });

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    return NextResponse.json(campaign);
  } catch (error) {
    console.error("Error fetching campaign:", error);
    return NextResponse.json({ error: "Failed to fetch campaign" }, { status: 500 });
  }
}

// ✅ DELETE: Delete campaign and its recipients
export async function DELETE(
  req: Request,
  // Corrected type for context.params
  context: { params: { id: string } }
) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = context.params.id;

  try {
    // First delete all recipients
    await prisma.recipient.deleteMany({ where: { campaignId: id } });

    // Then delete the campaign
    const deletedCampaign = await prisma.campaign.delete({ where: { id } });

    return NextResponse.json({ success: true, campaign: deletedCampaign });
  } catch (error) {
    console.error("Error deleting campaign:", error);
    return NextResponse.json({ error: "Failed to delete campaign" }, { status: 500 });
  }
}

// ✅ PUT: Update campaign
export async function PUT(
  req: Request,
  // Corrected type for context.params
  context: { params: { id: string } }
) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = context.params.id;

  try {
    const data = await req.json();
    const { title, subject, body, design, recipients } = data;

    const updatedCampaign = await prisma.campaign.update({
      where: { id },
      data: {
        title,
        subject,
        body,
        design,
        recipients: {
          deleteMany: {}, // Clear old recipients
          create: recipients?.map((r: any) => ({
            email: r.email,
            name: r.name,
            status: "pending",
          })) ?? [],
        },
      },
      include: { recipients: true },
    });

    return NextResponse.json({ success: true, updatedCampaign });
  } catch (error) {
    console.error("Error updating campaign:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}