import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API);

const from = process.env.MAIL_FROM ?? "CSGrind <onboarding@resend.dev>";
const siteUrl = process.env.SITE_URL ?? "http://localhost:5173";

export async function sendReportNotification(to: string) {
  const { error } = await resend.emails.send({
    from,
    to,
    subject: "Latest Report is here!",
    text: `New Grind report available ! Login on ${siteUrl}`,
  });

  if (error) {
    throw new Error(`Email send failed: ${error.message}`);
  }
}
