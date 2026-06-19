import { createServerFn } from "@tanstack/react-start";
import { getPool, initDb } from "./db";
import { sendSMS } from "./sms";
import type { Student } from "./storage";

// Server Function to initialize/verify MySQL tables
export const initDbFn = createServerFn({ method: "GET" }).handler(async () => {
  await initDb();
  return { success: true };
});

function sanitizeInput(text: string): string {
  if (!text) return "";
  return text.replace(/<[^>]*>/g, "").trim();
}

// Server Function to sync client registrations to MySQL and return remote records
export const syncStudentsFn = createServerFn({ method: "POST" })
  .validator((data: Student[]) => data)
  .handler(async ({ data: unsyncedStudents }) => {
    // 1. Ensure table is initialized
    await initDb();

    const pool = await getPool();
    const connection = await pool.getConnection();
    try {
      // 2. Process all unsynced students
      for (const s of unsyncedStudents) {
        // Validate customerId pattern
        if (!s.customerId || !/^UW-\d{4}-\d{4}$/.test(s.customerId)) {
          continue; // Skip invalid ID format
        }

        // Sanitize string inputs to prevent stored XSS attacks
        const cleanName = sanitizeInput(s.fullName).slice(0, 100);
        const cleanPhone = s.phone.replace(/[^\d+]/g, "").slice(0, 15);
        const cleanWhatsapp = s.whatsapp.replace(/[^\d+]/g, "").slice(0, 15);
        const cleanHostel = sanitizeInput(s.hostel).slice(0, 50);
        const cleanRoom = sanitizeInput(s.room).slice(0, 15);
        const cleanOffer = sanitizeInput(s.offer).slice(0, 50);
        const cleanSpeed = (s.serviceSpeed === "Express" ? "Express" : "Standard");

        if (!cleanName || !cleanPhone) {
          continue; // Skip invalid/empty records
        }

        // Check if student already exists in the cloud database
        const [rows] = await connection.query(
          "SELECT status, referredBy, referralStatus, phone FROM students WHERE customerId = ?",
          [s.customerId],
        );
        const existingRows = rows as Array<{ status: string; referredBy: string | null; referralStatus: string; phone: string }>;
        const exists = existingRows.length > 0;

        let finalStatus = "Lead Registered";
        let finalReferredBy = s.referredBy ? sanitizeInput(s.referredBy).slice(0, 20) : null;
        let finalReferralStatus = s.referralStatus === "Yes" ? "Yes" : "No";

        if (exists) {
          // Attack Mitigation: Prevent modification of other students' data (hijacking)
          if (existingRows[0].phone !== cleanPhone) {
            continue; // Phone numbers mismatch, reject request
          }
          // Prevent tampering with status/referral info
          finalStatus = existingRows[0].status;
          finalReferredBy = existingRows[0].referredBy;
          finalReferralStatus = existingRows[0].referralStatus;
        } else {
          // For new registrations, ensure phone number is unique to prevent duplicate/spam accounts (SMS abuse mitigation)
          const [phoneRows] = await connection.query(
            "SELECT customerId FROM students WHERE phone = ?",
            [cleanPhone],
          );
          if ((phoneRows as any[]).length > 0) {
            continue; // Phone number already registered, skip
          }

          // Validate that the referrer code actually exists
          if (finalReferredBy) {
            const [referrerRows] = await connection.query(
              "SELECT customerId FROM students WHERE customerId = ?",
              [finalReferredBy],
            );
            if ((referrerRows as any[]).length === 0) {
              finalReferredBy = null; // Reset to null if referrer is invalid
            }
          }
        }

        // Upsert record safely using parameterized query (SQL Injection mitigation)
        await connection.query(
          `INSERT INTO students 
            (customerId, fullName, phone, whatsapp, hostel, room, services, offer, referralStatus, referredBy, consent, status, createdAt, serviceSpeed) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE 
            fullName = VALUES(fullName),
            phone = VALUES(phone),
            whatsapp = VALUES(whatsapp),
            hostel = VALUES(hostel),
            room = VALUES(room),
            services = VALUES(services),
            offer = VALUES(offer),
            referralStatus = VALUES(referralStatus),
            referredBy = VALUES(referredBy),
            consent = VALUES(consent),
            status = VALUES(status),
            serviceSpeed = VALUES(serviceSpeed)`,
          [
            s.customerId,
            cleanName,
            cleanPhone,
            cleanWhatsapp,
            cleanHostel,
            cleanRoom,
            JSON.stringify(s.services || []),
            cleanOffer,
            finalReferralStatus,
            finalReferredBy,
            s.consent ? 1 : 0,
            finalStatus,
            s.createdAt || new Date().toISOString(),
            cleanSpeed,
          ],
        );

        // If it's a new registration, trigger Welcome SMS
        if (!exists) {
          const welcomeMsg = `Hi ${cleanName}! Welcome to URBAN WASH. ID: ${s.customerId}. Offer: ${cleanOffer}. Free pickup/delivery included. WhatsApp: +255687771750`;
          await sendSMS(cleanPhone, welcomeMsg);

          // If this student was referred by someone, check if that referrer hit the reward threshold (3 referrals)
          if (finalReferredBy) {
            const [refCountRows] = await connection.query(
              "SELECT COUNT(*) as count FROM students WHERE referredBy = ?",
              [finalReferredBy],
            );
            const refCount = (refCountRows as Array<{ count: number }>)[0].count;

            if (refCount === 3) {
              const [referrerRows] = await connection.query(
                "SELECT fullName, phone FROM students WHERE customerId = ?",
                [finalReferredBy],
              );
              const referrerList = referrerRows as Array<{ fullName: string; phone: string }>;
              if (referrerList.length > 0) {
                const referrer = referrerList[0];
                const rewardMsg = `Congrats ${referrer.fullName}! You referred 3 students and unlocked a FREE WASH! WhatsApp +255687771750 to claim your reward.`;
                await sendSMS(referrer.phone, rewardMsg);
              }
            }
          }
        }
      }

      // 3. Fetch all current database records to sync other clients
      const [allRows] = await connection.query("SELECT * FROM students");

      interface DbStudentRow {
        customerId: string;
        fullName: string;
        phone: string;
        whatsapp: string;
        hostel: string;
        room: string;
        services: string;
        offer: string;
        referralStatus: string;
        referredBy: string | null;
        consent: number;
        status: string;
        createdAt: string;
        serviceSpeed: string;
      }

      const allStudents: Student[] = (allRows as DbStudentRow[]).map((row) => ({
        customerId: row.customerId,
        fullName: row.fullName,
        phone: row.phone,
        whatsapp: row.whatsapp,
        hostel: row.hostel,
        room: row.room,
        services: JSON.parse(row.services || "[]"),
        offer: row.offer,
        referralStatus: row.referralStatus as "Yes" | "No",
        referredBy: row.referredBy || undefined,
        consent: row.consent === 1,
        status: row.status as Student["status"],
        createdAt: row.createdAt,
        serviceSpeed: (row.serviceSpeed || "Standard") as "Standard" | "Express",
        synced: true,
      }));

      return { success: true, students: allStudents };
    } catch (err) {
      console.error("Clever Cloud MySQL database sync error:", err);
      throw err;
    } finally {
      connection.release();
    }
  });

// Server Function to update status directly in cloud database (admin authenticated)
export const updateStudentStatusFn = createServerFn({ method: "POST" })
  .validator((data: { customerId: string; status: Student["status"]; passcode?: string }) => data)
  .handler(async ({ data: { customerId, status, passcode } }) => {
    const securePasscode = process.env.ADMIN_PASSCODE || "donttrythis";
    if (!passcode || passcode !== securePasscode) {
      throw new Error("Unauthorized: Invalid admin credentials");
    }
    await initDb();
    const pool = await getPool();
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        "SELECT fullName, phone, status FROM students WHERE customerId = ?",
        [customerId],
      );
      const studentList = rows as Array<{ fullName: string; phone: string; status: string }>;
      if (studentList.length > 0) {
        const student = studentList[0];
        const oldStatus = student.status;

        await connection.query("UPDATE students SET status = ? WHERE customerId = ?", [
          status,
          customerId,
        ]);

        // SMS notifications on status changes
        if (status === "First Order Completed" && oldStatus !== "First Order Completed") {
          const msg = `Hello ${student.fullName}! Your first order with URBAN WASH is completed. Thank you for choosing us! Slogan: Laundry Made Easy for Students.`;
          await sendSMS(student.phone, msg);
        } else if (status === "Repeat Customer" && oldStatus !== "Repeat Customer") {
          const msg = `Hello ${student.fullName}! Thank you for being a repeat customer of URBAN WASH. Enjoy FREE Pickup & Delivery on every order!`;
          await sendSMS(student.phone, msg);
        }
      }
      return { success: true };
    } catch (err) {
      console.error("Clever Cloud MySQL database status update error:", err);
      throw err;
    } finally {
      connection.release();
    }
  });

// Server Function to verify admin passcode
export const verifyAdminPasscodeFn = createServerFn({ method: "POST" })
  .validator((passcode: string) => passcode)
  .handler(async ({ data: passcode }) => {
    const securePasscode = process.env.ADMIN_PASSCODE || "donttrythis";
    return { success: passcode === securePasscode };
  });
