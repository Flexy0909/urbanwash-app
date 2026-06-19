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
  status: "Lead Registered" | "Contacted" | "First Order Completed" | "Repeat Customer" | "Referral Customer" | "VIP Customer";
  createdAt: string;
};

const KEY = "urbanwash_students_v1";

export function loadStudents(): Student[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveStudent(s: Student) {
  const all = loadStudents();
  all.push(s);
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function generateCustomerId(): string {
  const year = new Date().getFullYear();
  const count = loadStudents().length + 1;
  return `UW-${year}-${String(count).padStart(4, "0")}`;
}

export function exportCSV(students: Student[]): string {
  const headers = ["Customer ID", "Full Name", "Phone", "WhatsApp", "Hostel", "Room", "Services", "Offer", "Referral", "Status", "Date"];
  const rows = students.map((s) => [
    s.customerId, s.fullName, s.phone, s.whatsapp, s.hostel, s.room,
    s.services.join("; "), s.offer, s.referralStatus, s.status,
    new Date(s.createdAt).toLocaleString(),
  ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","));
  return [headers.join(","), ...rows].join("\n");
}

export function downloadFile(name: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);
}
