import { createServerFn } from "@tanstack/react-start";
import { getPool, initDb } from "./db";
import { sendSMS } from "./sms";
import type { Student } from "./storage";

// Server Function to initialize/verify MySQL tables
export const initDbFn = createServerFn({ method: "GET" }).handler(async () => {
  await initDb();
  return { success: true };
});

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
        // Check if student already exists in the cloud database
        const [rows] = await connection.query(
          "SELECT status, referredBy FROM students WHERE customerId = ?",
          [s.customerId],
        );
        const exists = (rows as Array<{ status: string; referredBy: string | null }>).length > 0;

        // Upsert record
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
            s.fullName,
            s.phone,
            s.whatsapp,
            s.hostel,
            s.room,
            JSON.stringify(s.services),
            s.offer,
            s.referralStatus,
            s.referredBy || null,
            s.consent ? 1 : 0,
            s.status,
            s.createdAt,
            s.serviceSpeed || "Standard",
          ],
        );

        // If it's a new registration, trigger Welcome SMS
        if (!exists) {
          const welcomeMsg = `Hello ${s.fullName}! Welcome to URBAN WASH 🧺. Your Customer ID is ${s.customerId}. Offer unlocked: ${s.offer}. Slogan: Laundry Made Easy for Students. Enjoy FREE Pickup & Delivery on every order!`;
          await sendSMS(s.phone, welcomeMsg);

          // If this student was referred by someone, check if that referrer hit the reward threshold (3 referrals)
          if (s.referredBy) {
            const [refCountRows] = await connection.query(
              "SELECT COUNT(*) as count FROM students WHERE referredBy = ?",
              [s.referredBy],
            );
            const refCount = (refCountRows as Array<{ count: number }>)[0].count;

            if (refCount === 3) {
              const [referrerRows] = await connection.query(
                "SELECT fullName, phone FROM students WHERE customerId = ?",
                [s.referredBy],
              );
              const referrerList = referrerRows as Array<{ fullName: string; phone: string }>;
              if (referrerList.length > 0) {
                const referrer = referrerList[0];
                const rewardMsg = `Congratulations ${referrer.fullName}! You have successfully referred 3 students to URBAN WASH. You have unlocked a FREE WASH FOR UP TO 5 CLOTHES! Contact us at +255686771750 to claim your reward.`;
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

// Server Function to update status directly in cloud database
export const updateStudentStatusFn = createServerFn({ method: "POST" })
  .validator((data: { customerId: string; status: Student["status"] }) => data)
  .handler(async ({ data: { customerId, status } }) => {
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
