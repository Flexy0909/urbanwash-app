import { syncStudentsFn, updateStudentStatusFn } from "./db-server";

export type Student = {
  customerId: string;
  fullName: string;
  phone: string;
  whatsapp: string;
  hostel: string;
  room: string;
  services: string[];
  offer: string;
  referralStatus: "Yes" | "No";
  referredBy?: string;
  consent: boolean;
  status:
    | "Lead Registered"
    | "Contacted"
    | "First Order Completed"
    | "Repeat Customer"
    | "Referral Customer"
    | "VIP Customer";
  createdAt: string;
  serviceSpeed: "Standard" | "Express";
  synced?: boolean;
};

const KEY = "urbanwash_students_v1";

// Load students from LocalStorage (fast fallback/cache)
export function loadStudents(): Student[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

// Save student locally first, then trigger background sync
export function saveStudent(s: Student) {
  const all = loadStudents();
  // Avoid duplicate additions
  const index = all.findIndex((x) => x.customerId === s.customerId);
  const updatedStudent = { ...s, synced: false };
  if (index >= 0) {
    all[index] = updatedStudent;
  } else {
    all.push(updatedStudent);
  }
  localStorage.setItem(KEY, JSON.stringify(all));

  // Trigger async sync in the background
  syncWithCloud();
}

// Update student status locally and sync
export function updateStudentStatus(customerId: string, status: Student["status"]) {
  const all = loadStudents();
  const student = all.find((x) => x.customerId === customerId);
  if (student) {
    student.status = status;
    student.synced = false;
    localStorage.setItem(KEY, JSON.stringify(all));

    // Call Server Function to update status in Clever Cloud MySQL
    updateStudentStatusFn({ data: { customerId, status } })
      .then(() => {
        // Mark as synced locally
        const currentLocal = loadStudents();
        const found = currentLocal.find((x) => x.customerId === customerId);
        if (found) {
          found.synced = true;
          localStorage.setItem(KEY, JSON.stringify(currentLocal));
        }
      })
      .catch((err) => {
        console.error("Failed to update status in cloud MySQL database:", err);
      });
  }
}

// Generate Customer ID based on current list count
export function generateCustomerId(): string {
  const year = new Date().getFullYear();
  const count = loadStudents().length + 1;
  return `UW-${year}-${String(count).padStart(4, "0")}`;
}

// Sync local storage with Clever Cloud MySQL via Server Functions
export async function syncWithCloud(
  onSyncComplete?: (data: Student[]) => void,
): Promise<Student[]> {
  try {
    const local = loadStudents();

    // 1. Filter local students that have synced === false
    const unsynced = local.filter((s) => s.synced === false);

    // 2. Call Server Function to push unsynced and fetch remote campaign registrations
    const response = await syncStudentsFn({ data: unsynced });

    if (response && response.success && response.students) {
      const cloudStudents = response.students;
      const currentLocal = loadStudents();
      const localMap = new Map(currentLocal.map((s) => [s.customerId, s]));

      // Merge database records
      cloudStudents.forEach((cs) => {
        const localRecord = localMap.get(cs.customerId);

        // If not in local, or local is already synced, overwrite/add from database
        if (!localRecord || localRecord.synced !== false) {
          localMap.set(cs.customerId, {
            ...cs,
            synced: true,
          });
        }
      });

      const merged = Array.from(localMap.values()).sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
      localStorage.setItem(KEY, JSON.stringify(merged));

      if (onSyncComplete) {
        onSyncComplete(merged);
      }
      return merged;
    }
  } catch (err) {
    console.error("Cloud database sync error:", err);
  }

  return loadStudents();
}

// Dynamic calculations for referrals
export function getReferralCount(customerId: string, all: Student[]): number {
  return all.filter((s) => s.referredBy === customerId).length;
}

export function getReferralRewardStatus(
  customerId: string,
  all: Student[],
): "Pending" | "Unlocked" {
  return getReferralCount(customerId, all) >= 3 ? "Unlocked" : "Pending";
}

// CSV Export format
export function exportCSV(students: Student[], allStudents: Student[]): string {
  const headers = [
    "Customer ID",
    "Full Name",
    "Phone",
    "WhatsApp",
    "Hostel",
    "Room",
    "Services Interested",
    "Selected Offer",
    "Referral Program Member",
    "Referred By ID",
    "Referrals Count",
    "Referral Reward Status",
    "Journey Status",
    "Service Speed",
    "Consent Given",
    "Registration Date",
  ];

  const rows = students.map((s) => {
    const refCount = getReferralCount(s.customerId, allStudents);
    const reward = getReferralRewardStatus(s.customerId, allStudents);
    return [
      s.customerId,
      s.fullName,
      s.phone,
      s.whatsapp,
      s.hostel,
      s.room,
      s.services.join("; "),
      s.offer,
      s.referralStatus,
      s.referredBy || "None",
      refCount,
      reward,
      s.status,
      s.serviceSpeed,
      s.consent ? "Yes" : "No",
      new Date(s.createdAt).toLocaleString(),
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",");
  });

  return [headers.join(","), ...rows].join("\n");
}

// Excel Export format (Clean XML/HTML table format with styles)
export function exportExcel(students: Student[], allStudents: Student[]): string {
  const title = "URBAN WASH Student Registrations Campaign";
  const dateStr = new Date().toLocaleDateString();

  let html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <style>
        body { font-family: Arial, sans-serif; }
        .title { font-size: 16pt; font-weight: bold; color: #1e3a8a; text-align: center; }
        .meta { font-size: 10pt; color: #666; text-align: center; margin-bottom: 20px; }
        th { background-color: #2563eb; color: #ffffff; font-weight: bold; border: 1px solid #cbd5e1; padding: 5px; }
        td { border: 1px solid #cbd5e1; padding: 5px; text-align: left; }
        .num { mso-number-format: "\\@"; } /* Force string formatting in excel to keep leading zeros in phone numbers */
        .badge { font-weight: bold; text-align: center; }
      </style>
    </head>
    <body>
      <table>
        <tr><td colspan="16" class="title">${title}</td></tr>
        <tr><td colspan="16" class="meta">Generated on ${dateStr} | Total Records: ${students.length}</td></tr>
        <tr><td></td></tr>
        <thead>
          <tr>
            <th>Customer ID</th>
            <th>Full Name</th>
            <th>Phone</th>
            <th>WhatsApp</th>
            <th>Hostel</th>
            <th>Room</th>
            <th>Services Interested</th>
            <th>Selected Offer</th>
            <th>Referral Program</th>
            <th>Referred By</th>
            <th>Referrals Count</th>
            <th>Reward Status</th>
            <th>Journey Status</th>
            <th>Service Speed</th>
            <th>Consent</th>
            <th>Registration Date</th>
          </tr>
        </thead>
        <tbody>
  `;

  students.forEach((s) => {
    const refCount = getReferralCount(s.customerId, allStudents);
    const reward = getReferralRewardStatus(s.customerId, allStudents);
    html += `
      <tr>
        <td style="font-family: monospace; font-weight: bold;">${s.customerId}</td>
        <td>${s.fullName}</td>
        <td class="num">${s.phone}</td>
        <td class="num">${s.whatsapp}</td>
        <td>${s.hostel}</td>
        <td>${s.room}</td>
        <td>${s.services.join(", ")}</td>
        <td>${s.offer}</td>
        <td style="text-align: center;">${s.referralStatus}</td>
        <td style="font-family: monospace;">${s.referredBy || "-"}</td>
        <td style="text-align: right;">${refCount}</td>
        <td class="badge" style="color: ${reward === "Unlocked" ? "#15803d" : "#b45309"}">${reward}</td>
        <td class="badge" style="color: #2563eb">${s.status}</td>
        <td style="text-align: center; font-weight: bold; color: ${s.serviceSpeed === "Express" ? "#dc2626" : "#475569"}">${s.serviceSpeed}</td>
        <td style="text-align: center;">${s.consent ? "Yes" : "No"}</td>
        <td>${new Date(s.createdAt).toLocaleDateString()}</td>
      </tr>
    `;
  });

  html += `
        </tbody>
      </table>
    </body>
    </html>
  `;
  return html;
}

// Download file utility
export function downloadFile(name: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * PREPARATION FOR FUTURE DATABASE SCHEMA & BROADCAST AUTOMATION
 *
 * Below are TypeScript definitions outlining the database models needed
 * to support Broadcast Campaigns, SMS, Loyalty systems, Coupons, and Scheduling.
 * These map to tables you would create in your MySQL database.
 */

export interface BroadcastCampaign {
  id: string;
  name: string;
  channel: "WhatsApp" | "SMS";
  templateText: string;
  targetHostels: string[];
  targetServices: string[];
  sentAt?: string;
  status: "Draft" | "Sending" | "Completed" | "Failed";
  successCount: number;
}

export interface LoyaltyAccount {
  customerId: string;
  pointsAccumulated: number;
  pointsRedeemed: number;
  vipTier: "Bronze" | "Silver" | "Gold" | "Platinum";
}

export interface CouponCode {
  code: string;
  discountType: "Percentage" | "FixedAmount" | "FreeService";
  value: number;
  maxUses: number;
  usesCount: number;
  expiryDate: string;
  isActive: boolean;
}

export interface PickupSchedule {
  id: string;
  customerId: string;
  pickupDate: string;
  pickupTimeSlot: "Morning (08:00 - 12:00)" | "Afternoon (12:00 - 16:00)" | "Evening (16:00 - 20:00)";
  status: "Scheduled" | "Driver Assigned" | "Picked Up" | "Cancelled";
  driverNotes?: string;
  deliveryDate?: string;
  deliveryStatus: "Pending" | "In Transit" | "Delivered";
}
