
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../../auth"
import { prisma } from "../../../../../../lib/prisma";
import nodemailer from "nodemailer";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } 
) {
  const session = await auth();

  const { id } = await params;
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
 console.log("this is error here")
  try {
    console.log("here is campaignId",id)
    const campaign = await prisma.campaign.findUnique({
      where: { id:  id },
      include: {
        recipients: true,
        user: true,
      },
    });

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

  
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT || "587"),
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // ✉️ Send emails one by one (can batch/send in parallel later)

    const rewriteLinks = (html: string, campaignId: string, recipientId: string) => {
      return html.replace(/href="(.*?)"/g, (_, originalUrl) => {
        const encodedUrl = encodeURIComponent(originalUrl);
        return `href="${process.env.NEXT_PUBLIC_BASE_URL}/api/tracking/click?cid=${campaignId}&rid=${recipientId}&url=${encodedUrl}"`;
      });
    };
    

    for (const recipient of campaign.recipients) {
      const trackingPixel = `<img src="${process.env.NEXT_PUBLIC_BASE_URL}/api/tracking/open?cid=${campaign.id}&rid=${recipient.id}" width="1" height="1" style="display:none;" />`;
      const personalizedBody = rewriteLinks(campaign.body, campaign.id, recipient.id)
        .replace(/{{name}}/g, recipient.name || "")
        .replace(/{{email}}/g, recipient.email)
        + trackingPixel;

      try {
        await transporter.sendMail({
          from: `"${campaign.user.name || "Bulk Mail Sender"}" <${process.env.MAIL_USER}>`,
          to: recipient.email,
          subject: campaign.subject,
          html: personalizedBody,
        });

        await prisma.recipient.update({
          where: { id: recipient.id },
          data: { status: "sent" },
        });
      } catch (err) {
        console.error(`❌ Failed to send to ${recipient.email}:`, err);
        await prisma.recipient.update({
          where: { id: recipient.id },
          data: { status: "failed" },
        });
      }
    }

    // ✅ Update campaign status
    await prisma.campaign.update({
      where: { id: campaign.id },
      data: { status: "sent" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Send campaign error:", error);
    return NextResponse.json({ error: "Failed to send campaign" }, { status: 500 });
  }
}
