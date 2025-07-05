// File: src/app/api/campaigns/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { auth } from "../../../../../auth"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  
  

  if (!id || typeof id !== "string") {
    console.error("Invalid ID provided:", id);
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }
  

  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id: id },
      include: {
        recipients: true,
      },
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


// DELETE: Remove a campaign by ID
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = context.params.id;

  try {
    // Step 1: Delete all recipients linked to this campaign
    await prisma.recipient.deleteMany({
      where: { campaignId: id },
    });

    // Step 2: Now delete the campaign
    const deletedCampaign = await prisma.campaign.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, campaign: deletedCampaign });
  } catch (error) {
    console.error("Error deleting campaign:", error);
    return NextResponse.json({ error: "Failed to delete campaign" }, { status: 500 });
  }
}


// PUT: Update a campaign
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const { title, subject, body, design, recipients } = data;

    const updatedCampaign = await prisma.campaign.update({
      where: { id: params.id },
      data: {
        title,
        subject,
        body,
        design,
        recipients: {
          deleteMany: {}, 
          create: recipients?.map((r: any) => ({
            email: r.email,
            name: r.name,
            status: "pending",
          })) ?? [],
        },
      },
      include: {
        recipients: true,
      },
    });

    return NextResponse.json({ success: true, updatedCampaign });
  } catch (error) {
    console.error("Error updating campaign:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
