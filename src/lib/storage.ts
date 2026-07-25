import { syncStudentsFn, updateStudentStatusFn, deleteStudentFn } from "./db-server";

export type OrderItem = {
  itemName: string;
  quantity: number;
  serviceType: "Wash & Fold" | "Iron Only" | "Wash & Iron";
  unitPrice: number;
  totalPrice: number;
  isCustom?: boolean;
  pricingStatus?: "Calculated" | "Pending Admin Pricing" | "Admin Confirmed";
};

export const ITEM_PRICING: Record<string, { "Wash & Fold": number; "Iron Only": number; "Wash & Iron": number }> = {
  "Shirt / T-Shirt": { "Wash & Fold": 500, "Iron Only": 500, "Wash & Iron": 1000 },
  "Suruali (Trousers/Jeans)": { "Wash & Fold": 500, "Iron Only": 500, "Wash & Iron": 1000 },
  "Shuka (Bed Sheet)": { "Wash & Fold": 1000, "Iron Only": 500, "Wash & Iron": 1500 },
  "Kanzu": { "Wash & Fold": 1000, "Iron Only": 500, "Wash & Iron": 1500 },
  "Taulo (Towel)": { "Wash & Fold": 1000, "Iron Only": 500, "Wash & Iron": 1500 },
  "Sweta / Hoodie": { "Wash & Fold": 1000, "Iron Only": 500, "Wash & Iron": 1500 },
  "Lab Coat": { "Wash & Fold": 1000, "Iron Only": 500, "Wash & Iron": 1500 },
  "Blanket / Duvet": { "Wash & Fold": 5000, "Iron Only": 500, "Wash & Iron": 5500 },
};

// Express Service Price Calculator Helper
export function getItemUnitPrice(
  itemName: string,
  serviceType: "Wash & Fold" | "Iron Only" | "Wash & Iron",
  isExpress: boolean = false,
): number {
  const stdPrice = ITEM_PRICING[itemName]?.[serviceType] || 0;
  if (!isExpress) return stdPrice;

  if (itemName === "Blanket / Duvet") {
    return stdPrice + 2500;
  }
  if (stdPrice <= 500) {
    return stdPrice + 500;
  }
  return stdPrice + 500;
}

export type FormResponse = {
  id: string;
  fullName: string;
  admissionNo?: string;
  phone: string;
  whatsapp?: string;
  hostel: string;
  room: string;
  services: string[];
  preferredDate?: string;
  preferredTimeSlot?: string;
  specialInstructions?: string;
  rating?: number;
  submittedAt: string;
};

const FORM_KEY = "urbanwash_form_responses_v1";

export function loadFormResponses(): FormResponse[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(FORM_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveFormResponse(response: FormResponse) {
  const all = loadFormResponses();
  all.unshift(response);
  localStorage.setItem(FORM_KEY, JSON.stringify(all));
}

export type Student = {
  customerId: string;
  orderId?: string;
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
    | "Picked Up & Verified"
    | "Washing & Drying"
    | "Ready for Delivery"
    | "First Order Completed"
    | "Repeat Customer"
    | "Referral Customer"
    | "VIP Customer";
  createdAt: string;
  serviceSpeed: "Standard" | "Express";
  leavingCampus?: "Today" | "Tomorrow" | "Within 3 Days" | "Next Week";
  pickupDate?: string; // ISO date string e.g. "2026-07-23"
  pickupTimeSlot?: "Morning (8AM - 11AM)" | "Afternoon (1PM - 4PM)" | "Evening (7PM - 10PM)";
  pinCode?: string; // 4-digit PIN code for account login
  synced?: boolean;

  // New Order Itemization & Admin Verification Fields
  orderItems?: OrderItem[];
  estimatedTotal?: number;
  adminConfirmedTotal?: number;
  adminVerified?: boolean;
  adminVerificationNotes?: string;
  verifiedAt?: string;

  // Mobile Money Payments & Security Fields
  paymentMethod?: "M-Pesa" | "Airtel Money" | "Cash";
  paymentStatus?: "Pending" | "Verification Submitted" | "Paid" | "Denied";
  paymentDenialReason?: string;
  transactionCode?: string;
  rating?: number; // 1-5 stars
  ratingComment?: string;
  isTempPin?: boolean;
};

export const DEFAULT_SEED_STUDENTS: Student[] = [
  {
    customerId: "UW-2026-0001",
    orderId: "ORD-2026-8801",
    fullName: "Juma Rashid",
    phone: "0712345678",
    whatsapp: "0712345678",
    hostel: "Hostel 1",
    room: "102",
    services: ["Wash & Iron"],
    offer: "Standard Student Wash",
    referralStatus: "Yes",
    consent: true,
    status: "Picked Up & Verified",
    createdAt: "2026-07-24T08:00:00.000Z",
    serviceSpeed: "Standard",
    pickupDate: "2026-07-24",
    pickupTimeSlot: "Morning (8AM - 11AM)",
    pinCode: "1234",
    paymentMethod: "M-Pesa",
    paymentStatus: "Paid",
    transactionCode: "DG4681NW4K",
    rating: 5,
    ratingComment: "Great service and quick turnaround!",
    estimatedTotal: 4500,
    synced: true,
  },
  {
    customerId: "UW-2026-0002",
    orderId: "ORD-2026-8802",
    fullName: "Neema Kilonzo",
    phone: "0655123456",
    whatsapp: "0655123456",
    hostel: "Hostel 2",
    room: "205",
    services: ["Washing", "Ironing"],
    offer: "Express Wash",
    referralStatus: "No",
    referredBy: "UW-2026-0001",
    consent: true,
    status: "Washing & Drying",
    createdAt: "2026-07-24T09:30:00.000Z",
    serviceSpeed: "Express",
    pickupDate: "2026-07-24",
    pickupTimeSlot: "Afternoon (1PM - 4PM)",
    pinCode: "5678",
    paymentMethod: "Airtel Money",
    paymentStatus: "Verification Submitted",
    transactionCode: "TID:MP260728.2242.Z52912",
    estimatedTotal: 6000,
    synced: true,
  },
  {
    customerId: "UW-2026-0003",
    orderId: "ORD-2026-8803",
    fullName: "Baraka Mwangi",
    phone: "0788990011",
    whatsapp: "0788990011",
    hostel: "Hostel 3",
    room: "310",
    services: ["Wash & Iron"],
    offer: "Standard Student Wash",
    referralStatus: "Yes",
    referredBy: "UW-2026-0001",
    consent: true,
    status: "Ready for Delivery",
    createdAt: "2026-07-24T10:15:00.000Z",
    serviceSpeed: "Standard",
    pickupDate: "2026-07-25",
    pickupTimeSlot: "Evening (7PM - 10PM)",
    pinCode: "9999",
    paymentMethod: "M-Pesa",
    paymentStatus: "Paid",
    transactionCode: "DG998877XX",
    rating: 5,
    ratingComment: "Clean clothes, neatly folded!",
    estimatedTotal: 3500,
    synced: true,
  },
];

const KEY = "urbanwash_students_v1";

// Load students from LocalStorage with seed fallback
export function loadStudents(): Student[] {
  if (typeof window === "undefined") return DEFAULT_SEED_STUDENTS;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw || raw === "[]") {
      localStorage.setItem(KEY, JSON.stringify(DEFAULT_SEED_STUDENTS));
      return DEFAULT_SEED_STUDENTS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_SEED_STUDENTS;
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
  syncWithCloud().catch((err) => {
    console.error("Background sync failed after saving student:", err);
  });
}
// Update student status locally and sync (passes admin passcode)
export function updateStudentStatus(customerId: string, status: Student["status"], passcode?: string) {
  const all = loadStudents();
  const student = all.find((x) => x.customerId === customerId);
  if (student) {
    student.status = status;
    student.synced = false;
    localStorage.setItem(KEY, JSON.stringify(all));

    // Call Server Function to update status in Clever Cloud MySQL
    const code = passcode || (typeof window !== "undefined" ? sessionStorage.getItem("urbanwash_admin_passcode") || "" : "");
    updateStudentStatusFn({ data: { customerId, status, passcode: code } })
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

// Delete student record locally and from cloud database
export function deleteStudent(customerId: string, passcode?: string) {
  const all = loadStudents();
  const filtered = all.filter((x) => x.customerId !== customerId);
  localStorage.setItem(KEY, JSON.stringify(filtered));

  const code = passcode || (typeof window !== "undefined" ? sessionStorage.getItem("urbanwash_admin_passcode") || "" : "");
  deleteStudentFn({ data: { customerId, passcode: code } }).catch((err) => {
    console.error("Cloud delete student failed:", err);
  });
}

// Update student order items & confirmation from Admin Panel
export function updateStudentOrderItems(
  customerId: string,
  orderItems: OrderItem[],
  adminConfirmedTotal: number,
  adminVerificationNotes?: string,
  newStatus?: Student["status"],
) {
  const all = loadStudents();
  const student = all.find((x) => x.customerId === customerId);
  if (student) {
    student.orderItems = orderItems;
    student.adminConfirmedTotal = adminConfirmedTotal;
    student.adminVerified = true;
    student.adminVerificationNotes = adminVerificationNotes || student.adminVerificationNotes;
    student.verifiedAt = new Date().toISOString();
    if (newStatus) student.status = newStatus;
    student.synced = false;
    localStorage.setItem(KEY, JSON.stringify(all));

    // Call server status update as well
    const code = typeof window !== "undefined" ? sessionStorage.getItem("urbanwash_admin_passcode") || "" : "";
    updateStudentStatusFn({ data: { customerId, status: student.status, passcode: code } }).catch((err) => {
      console.error("Failed to update cloud DB on order items confirmation:", err);
    });

    syncWithCloud().catch((err) => console.error("Cloud sync failed after admin verification:", err));
  }
}

// Generate Customer ID based on current list count
export function generateCustomerId(): string {
  const year = new Date().getFullYear();
  const count = loadStudents().length + 1;
  return `UW-${year}-${String(count).padStart(4, "0")}`;
}

// Generate unique Order ID for each laundry pickup
export function generateOrderId(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${year}-${randomNum}`;
}

// Sync local storage with Clever Cloud MySQL via Server Functions
export async function syncWithCloud(
  onSyncComplete?: (data: Student[]) => void,
): Promise<Student[]> {
  const local = loadStudents();

  // 1. Filter local students that have synced === false
  const unsynced = local.filter((s) => s.synced === false);

  try {
    // 2. Call Server Function to push unsynced and fetch remote campaign registrations
    const response = await syncStudentsFn({ data: unsynced });

    if (response && response.success && response.students) {
      const cloudStudents = response.students;
      const currentLocal = loadStudents();
      const localMap = new Map(currentLocal.map((s) => [s.customerId, s]));

      // Merge database records
      cloudStudents.forEach((cs) => {
        const localRecord = localMap.get(cs.customerId);

        if (!localRecord) {
          // If not in local, add from database
          localMap.set(cs.customerId, {
            ...cs,
            synced: true,
          });
        } else {
          // If already in local, merge server values (like status updates) and mark as synced
          localMap.set(cs.customerId, {
            ...localRecord,
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
    } else {
      throw new Error("Invalid sync response structure");
    }
  } catch (err) {
    console.error("Cloud database sync error:", err);
    throw err; // Propagate to let callers handle error state
  }
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
