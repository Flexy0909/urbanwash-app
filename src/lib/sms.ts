export function formatTanzaniaNumber(phone: string): string {
  // Strip any spaces, dashes, or plus signs
  const cleaned = phone.replace(/[\s\-+]+/g, "");

  // If starts with 255, keep it
  if (cleaned.startsWith("255") && cleaned.length === 12) {
    return cleaned;
  }

  // If starts with 07 or 06, replace with 2557 or 2556
  if (cleaned.startsWith("0") && cleaned.length === 10) {
    return "255" + cleaned.slice(1);
  }

  // If it's a 9-digit number starting with 7 or 6, prepend 255
  if (cleaned.length === 9 && (cleaned.startsWith("7") || cleaned.startsWith("6"))) {
    return "255" + cleaned;
  }

  return cleaned;
}

export async function sendSMS(toPhone: string, messageText: string, reference?: string): Promise<boolean> {
  const token = process.env.SMS_TOKEN;
  if (!token) {
    console.error("SMS_TOKEN environment variable is not set — SMS not sent");
    return;
  }
  const recipient = formatTanzaniaNumber(toPhone);
  const ref = reference || `reg_${Date.now()}`;

  console.log(`Attempting to send SMS to ${recipient} via Tanzania Messaging v2...`);

  try {
    const response = await fetch("https://messaging-service.co.tz/api/sms/v2/text/single", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        from: "URBAN WASH",
        to: recipient,
        text: messageText,
        reference: ref,
      }),
    });

    const data = await response.json().catch(() => null);

    if (response.ok) {
      console.log(`SMS successfully dispatched to ${recipient}:`, data);
      return true;
    } else {
      console.error(`Tanzania Messaging API v2 returned status ${response.status}:`, data);
      return false;
    }
  } catch (error) {
    console.error("Tanzania Messaging API v2 network transmission failed:", error);
    return false;
  }
}
