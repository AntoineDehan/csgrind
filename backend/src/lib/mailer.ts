import { Resend } from "resend";
import { env } from "../config/env";

const resend = env.RESEND_API ? new Resend(env.RESEND_API) : null;

export function isMailerEnabled(): boolean {
  return resend !== null;
}

function reportEmailHtml(reportUrl: string): string {
  return `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:32px 16px;background-color:#131419;font-family:Helvetica,Arial,sans-serif;">
    <div style="max-width:520px;margin:0 auto;background-color:#1b1d24;border:1px solid #33353d;border-radius:12px;padding:32px;">
      <p style="margin:0 0 8px;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#53ca65;">
        New report
      </p>
      <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;color:#fbfaf6;">
        Your new report is ready.
      </h1>
      <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#d8d4cb;">
        See what improved, what slipped, and the drills to work on before your
        next session.
      </p>
      <a href="${reportUrl}"
         style="display:inline-block;padding:12px 24px;border-radius:8px;background-color:#53ca65;color:#131419;font-size:15px;font-weight:bold;text-decoration:none;">
        View my report
      </a>
      <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#6b6375;">
        Keep grinding.
      </p>
    </div>
  </body>
</html>`;
}

export async function sendReportNotification(to: string, reportId: string) {
  if (!resend) {
    console.warn("RESEND_API is not configured, skipping report notification");
    return;
  }

  const reportUrl = `${env.SITE_URL}/reports/${reportId}`;

  const { error } = await resend.emails.send({
    from: env.MAIL_FROM,
    to,
    subject: "Your new csgrind report is ready",
    text: `Your new report is ready.\n\nSee what improved, what slipped, and the drills to work on before your next session.\n\nView it here: ${reportUrl}\n\nKeep grinding.`,
    html: reportEmailHtml(reportUrl),
  });

  if (error) {
    throw new Error(`Email send failed: ${error.message}`);
  }
}
