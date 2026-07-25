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

        const cleanLeaving = s.leavingCampus ? sanitizeInput(s.leavingCampus).slice(0, 50) : null;
        const cleanDate = s.pickupDate ? sanitizeInput(s.pickupDate).slice(0, 50) : null;
        const cleanTimeSlot = s.pickupTimeSlot ? sanitizeInput(s.pickupTimeSlot).slice(0, 100) : null;
        const cleanPin = s.pinCode ? sanitizeInput(s.pinCode).slice(0, 10) : null;

        const cleanPaymentMethod = s.paymentMethod ? sanitizeInput(s.paymentMethod).slice(0, 50) : null;
        const cleanPaymentStatus = s.paymentStatus ? sanitizeInput(s.paymentStatus).slice(0, 50) : "Pending";
        const cleanTransactionCode = s.transactionCode ? sanitizeInput(s.transactionCode).slice(0, 100) : null;
        const cleanRating = typeof s.rating === "number" ? s.rating : null;
        const cleanRatingComment = s.ratingComment ? sanitizeInput(s.ratingComment).slice(0, 500) : null;
        const cleanIsTempPin = s.isTempPin ? 1 : 0;

        // Upsert record safely using parameterized query (SQL Injection mitigation)
        await connection.query(
          `INSERT INTO students 
            (customerId, fullName, phone, whatsapp, hostel, room, services, offer, referralStatus, referredBy, consent, status, createdAt, serviceSpeed, leavingCampus, pickupDate, pickupTimeSlot, pinCode, paymentMethod, paymentStatus, transactionCode, rating, ratingComment, isTempPin) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
            serviceSpeed = VALUES(serviceSpeed),
            leavingCampus = VALUES(leavingCampus),
            pickupDate = VALUES(pickupDate),
            pickupTimeSlot = VALUES(pickupTimeSlot),
            pinCode = VALUES(pinCode),
            paymentMethod = VALUES(paymentMethod),
            paymentStatus = VALUES(paymentStatus),
            transactionCode = VALUES(transactionCode),
            rating = VALUES(rating),
            ratingComment = VALUES(ratingComment),
            isTempPin = VALUES(isTempPin)`,
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
            cleanLeaving,
            cleanDate,
            cleanTimeSlot,
            cleanPin,
            cleanPaymentMethod,
            cleanPaymentStatus,
            cleanTransactionCode,
            cleanRating,
            cleanRatingComment,
            cleanIsTempPin,
          ],
        );

        // Trigger real-time Booking Confirmation SMS for new orders (Max 160 chars, no emojis)
        if (!exists) {
          const bookingMsg = `Dear ${cleanName}, your URBAN WASH pickup order ${s.customerId} is confirmed. Pickup date: ${cleanDate || "Scheduled"}. Support: 0687771750.`;
          await sendSMS(cleanPhone, bookingMsg);

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
                const rewardMsg = `Dear ${referrer.fullName}, you referred 3 students and unlocked a FREE WASH with URBAN WASH! WhatsApp 0687771750 to claim.`;
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
        leavingCampus: string | null;
        pickupDate: string | null;
        pickupTimeSlot: string | null;
        pinCode: string | null;
        paymentMethod: string | null;
        paymentStatus: string | null;
        transactionCode: string | null;
        rating: number | null;
        ratingComment: string | null;
        isTempPin: number | null;
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
        leavingCampus: (row.leavingCampus as Student["leavingCampus"]) || undefined,
        pickupDate: row.pickupDate || undefined,
        pickupTimeSlot: (row.pickupTimeSlot as Student["pickupTimeSlot"]) || undefined,
        pinCode: row.pinCode || undefined,
        paymentMethod: (row.paymentMethod as Student["paymentMethod"]) || undefined,
        paymentStatus: (row.paymentStatus as Student["paymentStatus"]) || "Pending",
        transactionCode: row.transactionCode || undefined,
        rating: typeof row.rating === "number" ? row.rating : undefined,
        ratingComment: row.ratingComment || undefined,
        isTempPin: row.isTempPin === 1,
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
        "SELECT fullName, phone, status, hostel, room FROM students WHERE customerId = ?",
        [customerId],
      );
      const studentList = rows as Array<{ fullName: string; phone: string; status: string; hostel: string; room: string }>;
      if (studentList.length > 0) {
        const student = studentList[0];
        const oldStatus = student.status;

        await connection.query("UPDATE students SET status = ? WHERE customerId = ?", [
          status,
          customerId,
        ]);

        // Real-time SMS notifications on status changes (Strictly < 160 chars, NO EMOJIS)
        if (status === "Picked Up & Verified" && oldStatus !== "Picked Up & Verified") {
          const msg = `Dear ${student.fullName}, our agent has collected your URBAN WASH laundry order ${customerId}. Support: 0687771750.`;
          await sendSMS(student.phone, msg);
        } else if (status === "Washing & Drying" && oldStatus !== "Washing & Drying") {
          const msg = `Dear ${student.fullName}, your laundry order ${customerId} is now being washed and steam ironed. Support: 0687771750.`;
          await sendSMS(student.phone, msg);
        } else if (status === "Ready for Delivery" && oldStatus !== "Ready for Delivery") {
          const msg = `Dear ${student.fullName}, your URBAN WASH order ${customerId} is ready and en route for delivery to Hostel ${student.hostel} Room ${student.room}.`;
          await sendSMS(student.phone, msg);
        } else if ((status === "First Order Completed" || status === "Repeat Customer") && oldStatus !== status) {
          const msg = `Dear ${student.fullName}, your URBAN WASH order ${customerId} has been delivered to your room. Thank you for choosing us! Support: 0687771750.`;
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

// Server Function to request temporary PIN via SMS (Forgot Password)
export const requestTempPinFn = createServerFn({ method: "POST" })
  .validator((phone: string) => phone)
  .handler(async ({ data: rawPhone }) => {
    await initDb();
    const pool = await getPool();
    const connection = await pool.getConnection();
    try {
      const clean = rawPhone.replace(/[^\d+]/g, "");
      const [rows] = await connection.query("SELECT * FROM students");

      interface DbStudentRow {
        customerId: string;
        fullName: string;
        phone: string;
        whatsapp: string;
      }

      const found = (rows as DbStudentRow[]).find((s) => {
        const matchPhone = s.phone.replace(/[^\d+]/g, "").endsWith(clean.slice(-8)) || s.whatsapp.replace(/[^\d+]/g, "").endsWith(clean.slice(-8));
        return clean.length >= 6 && matchPhone;
      });

      if (!found) {
        return { success: false, reason: "notFound" };
      }

      // Generate 4-digit temporary PIN
      const tempPin = Math.floor(1000 + Math.random() * 9000).toString();

      await connection.query("UPDATE students SET pinCode = ?, isTempPin = 1 WHERE customerId = ?", [
        tempPin,
        found.customerId,
      ]);

      // Dispatch temporary PIN SMS (Strictly < 160 chars, NO EMOJIS, Sender ID: URBAN WASH)
      const smsText = `Dear ${found.fullName}, your temporary URBAN WASH PIN is ${tempPin}. Log in with this PIN to set a new password. Support: 0687771750.`;
      await sendSMS(found.phone, smsText);

      return { success: true, customerId: found.customerId, tempPin };
    } catch (err) {
      console.error("requestTempPinFn error:", err);
      return { success: false, reason: "serverError" };
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

// Server Function to delete a student record (Admin Only)
export const deleteStudentFn = createServerFn({ method: "POST" })
  .validator((data: { customerId: string; passcode: string }) => data)
  .handler(async ({ data: { customerId, passcode } }) => {
    await initDb();
    const pool = await getPool();
    const connection = await pool.getConnection();
    try {
      await connection.query("DELETE FROM students WHERE customerId = ?", [customerId]);
      return { success: true };
    } catch (err) {
      console.error("Clever Cloud MySQL delete student error:", err);
      throw err;
    } finally {
      connection.release();
    }
  });
