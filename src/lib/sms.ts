export function formatTanzaniaNumber(phone: string): string {
  // Strip any spaces, dashes, or plus signs
  let cleaned = phone.replace(/[\s\-\+]+/g, "");

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

export async function sendSMS(toPhone: string, messageText: string): Promise<boolean> {
  const token = process.env.SMS_TOKEN || "463daca6c2382a4d31560a31d0c16f72";
  const senderId = process.env.SMS_SENDER_ID || "NEXTSMS"; // Standard NextSMS fallback
  
  const recipient = formatTanzaniaNumber(toPhone);
  
  console.log(`Attempting to send SMS to ${recipient} via Next SMS...`);

  try {
    const response = await fetch("https://messaging-service.co.tz/api/sms/v1/text/single", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${token}`,
      },
      body: JSON.stringify({
        from: senderId,
        to: recipient,
        text: messageText,
      }),
    });

    const data = await response.json().catch(() => null);

    if (response.ok) {
      console.log(`SMS successfully dispatched to ${recipient}:`, data);
      return true;
    } else {
      console.error(`Next SMS API returned status ${response.status}:`, data);
      return false;
    }
  } catch (error) {
    console.error("Next SMS network transmission failed:", error);
    return false;
  }
}
