export interface VCardOptions {
  name: string;
  title?: string;
  company?: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  websiteUrl?: string;
  address?: string;
  bio?: string;
}

export function generateVCardString(options: VCardOptions): string {
  const parts = options.name.trim().split(" ");
  const firstName = parts[0] || "";
  const lastName = parts.slice(1).join(" ") || "";

  const lines: string[] = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${lastName};${firstName};;;`,
    `FN:${options.name}`,
  ];

  if (options.company) {
    lines.push(`ORG:${options.company}`);
  }

  if (options.title) {
    lines.push(`TITLE:${options.title}`);
  }

  if (options.phone) {
    const cleanPhone = options.phone.replace(/[^\d+]/g, "");
    lines.push(`TEL;TYPE=CELL,VOICE:${cleanPhone}`);
  }

  if (options.whatsapp && options.whatsapp !== options.phone) {
    const cleanWa = options.whatsapp.replace(/[^\d+]/g, "");
    lines.push(`TEL;TYPE=WORK,MSG:${cleanWa}`);
  }

  if (options.email) {
    lines.push(`EMAIL;TYPE=INTERNET,WORK:${options.email}`);
  }

  if (options.websiteUrl) {
    lines.push(`URL:${options.websiteUrl}`);
  }

  if (options.address) {
    lines.push(`ADR;TYPE=WORK:;;${options.address};;;;`);
  }

  if (options.bio) {
    // Sanitize newlines for vCard specification
    const cleanNote = options.bio.replace(/\r?\n/g, "\\n");
    lines.push(`NOTE:${cleanNote}`);
  }

  lines.push("END:VCARD");
  return lines.join("\r\n");
}
