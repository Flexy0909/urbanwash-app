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

        // Multi-order support: Write this specific order into student_orders table
        if (s.orderId) {
          const finalOrderId = s.orderId;
          await connection.query(
            `INSERT INTO student_orders 
              (orderId, customerId, services, offer, serviceSpeed, leavingCampus, pickupDate, pickupTimeSlot, status, paymentMethod, paymentStatus, transactionCode, rating, ratingComment, createdAt) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE 
              services = VALUES(services),
              offer = VALUES(offer),
              serviceSpeed = VALUES(serviceSpeed),
              leavingCampus = VALUES(leavingCampus),
              pickupDate = VALUES(pickupDate),
              pickupTimeSlot = VALUES(pickupTimeSlot),
              status = VALUES(status),
              paymentMethod = VALUES(paymentMethod),
              paymentStatus = VALUES(paymentStatus),
              transactionCode = VALUES(transactionCode),
              rating = VALUES(rating),
              ratingComment = VALUES(ratingComment)`,
            [
              finalOrderId,
              s.customerId,
              JSON.stringify(s.services || []),
              s.offer,
              s.serviceSpeed || "Standard",
              s.leavingCampus || null,
              s.pickupDate || null,
              s.pickupTimeSlot || null,
              finalStatus,
              cleanPaymentMethod || null,
              cleanPaymentStatus || "Pending",
              cleanTransactionCode || null,
              cleanRating,
              cleanRatingComment,
              s.createdAt || new Date().toISOString(),
            ]
          );
        }

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

      // 3. Fetch all current database records joined with student orders
      const [allRows] = await connection.query(
        `SELECT o.orderId, s.customerId, s.fullName, s.phone, s.whatsapp, s.hostel, s.room, s.pinCode, s.referralStatus, s.referredBy, s.consent, s.isTempPin,
                COALESCE(o.services, '[]') as services, COALESCE(o.offer, s.offer) as offer, COALESCE(o.serviceSpeed, s.serviceSpeed) as serviceSpeed,
                o.leavingCampus, o.pickupDate, o.pickupTimeSlot, o.status, o.paymentMethod, o.paymentStatus, o.transactionCode, o.rating, o.ratingComment,
                COALESCE(o.createdAt, s.createdAt) as createdAt
         FROM students s
         LEFT JOIN student_orders o ON s.customerId = o.customerId
         ORDER BY createdAt DESC`
      );

      interface DbStudentRow {
        orderId: string | null;
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
        status: string | null;
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
        orderId: row.orderId || undefined,
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
        status: (row.status || "Lead Registered") as Student["status"],
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
  .handler(async ({ data: { customerId: orderOrCustId, status, passcode } }) => {
    const securePasscode = process.env.ADMIN_PASSCODE;
    if (!securePasscode) throw new Error("ADMIN_PASSCODE environment variable is not set");
    if (!passcode || passcode !== securePasscode) {
      throw new Error("Unauthorized: Invalid admin credentials");
    }
    await initDb();
    const pool = await getPool();
    const connection = await pool.getConnection();
    try {
      const isOrder = orderOrCustId.startsWith("ORD-");
      let studentName = "";
      let studentPhone = "";
      let oldStatus = "Lead Registered";
      let hostel = "";
      let room = "";
      let actualCustId = orderOrCustId;

      if (isOrder) {
        // Query current order status and student info
        const [rows] = await connection.query(
          `SELECT o.status, s.fullName, s.phone, s.hostel, s.room, s.customerId
           FROM student_orders o
           JOIN students s ON o.customerId = s.customerId
           WHERE o.orderId = ?`,
          [orderOrCustId],
        );
        const list = rows as Array<{ status: string; fullName: string; phone: string; hostel: string; room: string; customerId: string }>;
        if (list.length > 0) {
          oldStatus = list[0].status;
          studentName = list[0].fullName;
          studentPhone = list[0].phone;
          hostel = list[0].hostel;
          room = list[0].room;
          actualCustId = list[0].customerId;
        }

        // Update status in student_orders
        await connection.query("UPDATE student_orders SET status = ? WHERE orderId = ?", [
          status,
          orderOrCustId,
        ]);
        // Sync back to student profile
        await connection.query("UPDATE students SET status = ? WHERE customerId = ?", [
          status,
          actualCustId,
        ]);
      } else {
        const [rows] = await connection.query(
          "SELECT fullName, phone, status, hostel, room, customerId FROM students WHERE customerId = ?",
          [orderOrCustId],
        );
        const studentList = rows as Array<{ fullName: string; phone: string; status: string; hostel: string; room: string; customerId: string }>;
        if (studentList.length > 0) {
          const student = studentList[0];
          oldStatus = student.status;
          studentName = student.fullName;
          studentPhone = student.phone;
          hostel = student.hostel;
          room = student.room;
          actualCustId = student.customerId;
        }

        await connection.query("UPDATE students SET status = ? WHERE customerId = ?", [
          status,
          orderOrCustId,
        ]);
        // Update latest order
        await connection.query("UPDATE student_orders SET status = ? WHERE customerId = ? ORDER BY createdAt DESC LIMIT 1", [
          status,
          orderOrCustId,
        ]);
      }

      if (studentPhone) {
        const displayId = isOrder ? orderOrCustId : actualCustId;
        // Real-time SMS notifications on status changes (Strictly < 160 chars, NO EMOJIS)
        if (status === "Picked Up & Verified" && oldStatus !== "Picked Up & Verified") {
          const msg = `Dear ${studentName}, our agent has collected your URBAN WASH laundry order ${displayId}. Support: 0687771750.`;
          await sendSMS(studentPhone, msg);
        } else if (status === "Washing & Drying" && oldStatus !== "Washing & Drying") {
          const msg = `Dear ${studentName}, your laundry order ${displayId} is now being washed and steam ironed. Support: 0687771750.`;
          await sendSMS(studentPhone, msg);
        } else if (status === "Ready for Delivery" && oldStatus !== "Ready for Delivery") {
          const msg = `Dear ${studentName}, your URBAN WASH order ${displayId} is ready and en route for delivery to Hostel ${hostel} Room ${room}.`;
          await sendSMS(studentPhone, msg);
        } else if ((status === "First Order Completed" || status === "Repeat Customer") && oldStatus !== status) {
          const msg = `Dear ${studentName}, your URBAN WASH order ${displayId} has been delivered to your room. Thank you for choosing us! Support: 0687771750.`;
          await sendSMS(studentPhone, msg);
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
      const cleanInput = rawPhone.replace(/\D/g, "");
      const inputLast9 = cleanInput.slice(-9);
      const [rows] = await connection.query("SELECT * FROM students");

      interface DbStudentRow {
        customerId: string;
        fullName: string;
        phone: string;
        whatsapp: string;
      }

      const found = (rows as DbStudentRow[]).find((s) => {
        const cleanDbPhone = s.phone.replace(/\D/g, "");
        const cleanDbWhatsapp = s.whatsapp.replace(/\D/g, "");
        return (
          (cleanDbPhone.length >= 9 && cleanDbPhone.endsWith(inputLast9)) ||
          (cleanDbWhatsapp.length >= 9 && cleanDbWhatsapp.endsWith(inputLast9))
        );
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
    const securePasscode = process.env.ADMIN_PASSCODE;
    if (!securePasscode) return { success: false };
  });

// Server Function to fetch all orders for a specific student
export const getStudentOrdersFn = createServerFn({ method: "POST" })
  .validator((data: { customerId: string }) => data)
  .handler(async ({ data: { customerId } }) => {
    await initDb();
    const pool = await getPool();
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        "SELECT * FROM student_orders WHERE customerId = ? ORDER BY createdAt DESC",
        [customerId],
      );
      return { success: true, orders: rows };
    } catch (err) {
      console.error("getStudentOrdersFn error:", err);
      return { success: false, orders: [] };
    } finally {
      connection.release();
    }
  });

// Server Function to save/upsert a single order row
export const saveOrderFn = createServerFn({ method: "POST" })
  .validator((data: {
    orderId: string; customerId: string; services: string[]; offer: string;
    serviceSpeed: string; pickupDate?: string; pickupTimeSlot?: string;
    paymentMethod?: string; paymentStatus?: string; transactionCode?: string;
    createdAt: string;
  }) => data)
  .handler(async ({ data }) => {
    await initDb();
    const pool = await getPool();
    const connection = await pool.getConnection();
    try {
      await connection.query(
        `INSERT INTO student_orders
          (orderId, customerId, services, offer, serviceSpeed, pickupDate, pickupTimeSlot,
           status, paymentMethod, paymentStatus, transactionCode, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'Lead Registered', ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           services = VALUES(services), offer = VALUES(offer),
           paymentMethod = VALUES(paymentMethod), paymentStatus = VALUES(paymentStatus),
           transactionCode = VALUES(transactionCode)`,
        [
          data.orderId, data.customerId, JSON.stringify(data.services), data.offer,
          data.serviceSpeed, data.pickupDate || null, data.pickupTimeSlot || null,
          data.paymentMethod || null, data.paymentStatus || "Pending",
          data.transactionCode || null, data.createdAt,
        ],
      );
      return { success: true };
    } catch (err) {
      console.error("saveOrderFn error:", err);
      throw err;
    } finally {
      connection.release();
    }
  });

// Server Function to fetch ALL orders (for admin dashboard)
export const getAllOrdersFn = createServerFn({ method: "GET" })
  .handler(async () => {
    await initDb();
    const pool = await getPool();
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        `SELECT o.*, s.fullName, s.phone, s.hostel, s.room, s.pinCode
         FROM student_orders o
         JOIN students s ON o.customerId = s.customerId
         ORDER BY o.createdAt DESC`,
      );
      return { success: true, orders: rows };
    } catch (err) {
      console.error("getAllOrdersFn error:", err);
      return { success: false, orders: [] };
    } finally {
      connection.release();
    }
  });

// Server Function to delete a student record (Admin Only)
export const deleteStudentFn = createServerFn({ method: "POST" })
  .validator((data: { customerId: string; passcode: string }) => data)
  .handler(async ({ data: { customerId, passcode } }) => {
    const securePasscode = process.env.ADMIN_PASSCODE;
    if (!securePasscode) throw new Error("ADMIN_PASSCODE environment variable is not set");
    if (!passcode || passcode !== securePasscode) {
      throw new Error("Unauthorized: Invalid admin credentials");
    }
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
