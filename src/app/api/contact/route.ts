import { NextResponse } from "next/server";
import { Resend } from "resend";
import { site } from "@/content/site";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME = 100;
const MAX_EMAIL = 200;
const MAX_MESSAGE = 5000;

const recipient = site.contact.links.find((link) => link.type === "email")?.label ?? "conor@conor-ui.com";

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  company?: unknown; // honeypot — real users never fill this in
};

export async function POST(request: Request) {
  let body: ContactPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot: bots that fill in every field trip this; humans never see it.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name || name.length > MAX_NAME) {
    return NextResponse.json({ ok: false, error: "Please provide a valid name." }, { status: 400 });
  }
  if (!email || email.length > MAX_EMAIL || !EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "Please provide a valid email address." }, { status: 400 });
  }
  if (!message || message.length > MAX_MESSAGE) {
    return NextResponse.json({ ok: false, error: "Please provide a message." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set; cannot send contact form email.");
    return NextResponse.json({ ok: false, error: "Email is not configured on the server." }, { status: 500 });
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    to: recipient,
    from: recipient,
    replyTo: email,
    subject: `Portfolio contact form: ${name}`,
    text: `From: ${name} <${email}>\n\n${message}`,
    html: `<p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p><p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>`,
  });

  if (error) {
    console.error("Resend send failed:", error);
    // Resend's error message describes *why* (e.g. unverified sender domain,
    // bad key scope) and never contains the key itself, so it's safe to
    // surface — much faster to debug from the form than digging through host
    // logs.
    const baseMessage = "Could not send message. Please try again later.";
    return NextResponse.json({ ok: false, error: error.message ? `${baseMessage} (${error.message})` : baseMessage }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return "&#39;";
    }
  });
}
