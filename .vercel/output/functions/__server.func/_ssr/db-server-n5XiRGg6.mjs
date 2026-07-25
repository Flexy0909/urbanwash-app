import { i as TSS_SERVER_FUNCTION, l as createServerFn } from "./esm-Dova13aH.mjs";
import { n as initDb, t as getPool } from "./db-BCIAkAbK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/db-server-n5XiRGg6.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
function formatTanzaniaNumber(phone) {
	const cleaned = phone.replace(/[\s\-+]+/g, "");
	if (cleaned.startsWith("255") && cleaned.length === 12) return cleaned;
	if (cleaned.startsWith("0") && cleaned.length === 10) return "255" + cleaned.slice(1);
	if (cleaned.length === 9 && (cleaned.startsWith("7") || cleaned.startsWith("6"))) return "255" + cleaned;
	return cleaned;
}
async function sendSMS(toPhone, messageText, reference) {
	const token = process.env.SMS_TOKEN || "463daca6c2382a4d31560a31d0c16f72";
	const recipient = formatTanzaniaNumber(toPhone);
	const ref = reference || `reg_${Date.now()}`;
	console.log(`Attempting to send SMS to ${recipient} via Tanzania Messaging v2...`);
	try {
		const response = await fetch("https://messaging-service.co.tz/api/sms/v2/text/single", {
			method: "POST",
			headers: {
				"Authorization": `Bearer ${token}`,
				"Content-Type": "application/json",
				"Accept": "application/json"
			},
			body: JSON.stringify({
				from: "URBAN WASH",
				to: recipient,
				text: messageText,
				reference: ref
			})
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
var initDbFn_createServerFn_handler = createServerRpc({
	id: "54d70ed88108a51fa8b0937945c76d00d57555b66db04e17e04b28aaf5188370",
	name: "initDbFn",
	filename: "src/lib/db-server.ts"
}, (opts) => initDbFn.__executeServer(opts));
var initDbFn = createServerFn({ method: "GET" }).handler(initDbFn_createServerFn_handler, async () => {
	await initDb();
	return { success: true };
});
function sanitizeInput(text) {
	if (!text) return "";
	return text.replace(/<[^>]*>/g, "").trim();
}
var syncStudentsFn_createServerFn_handler = createServerRpc({
	id: "b999ba7cab68cd4c85afacfae01e4742a5bb6c11c9a16fdbc426b55396af3798",
	name: "syncStudentsFn",
	filename: "src/lib/db-server.ts"
}, (opts) => syncStudentsFn.__executeServer(opts));
var syncStudentsFn = createServerFn({ method: "POST" }).validator((data) => data).handler(syncStudentsFn_createServerFn_handler, async ({ data: unsyncedStudents }) => {
	await initDb();
	const connection = await (await getPool()).getConnection();
	try {
		for (const s of unsyncedStudents) {
			if (!s.customerId || !/^UW-\d{4}-\d{4}$/.test(s.customerId)) continue;
			const cleanName = sanitizeInput(s.fullName).slice(0, 100);
			const cleanPhone = s.phone.replace(/[^\d+]/g, "").slice(0, 15);
			const cleanWhatsapp = s.whatsapp.replace(/[^\d+]/g, "").slice(0, 15);
			const cleanHostel = sanitizeInput(s.hostel).slice(0, 50);
			const cleanRoom = sanitizeInput(s.room).slice(0, 15);
			const cleanOffer = sanitizeInput(s.offer).slice(0, 50);
			const cleanSpeed = s.serviceSpeed === "Express" ? "Express" : "Standard";
			if (!cleanName || !cleanPhone) continue;
			const [rows] = await connection.query("SELECT status, referredBy, referralStatus, phone FROM students WHERE customerId = ?", [s.customerId]);
			const existingRows = rows;
			const exists = existingRows.length > 0;
			let finalStatus = "Lead Registered";
			let finalReferredBy = s.referredBy ? sanitizeInput(s.referredBy).slice(0, 20) : null;
			let finalReferralStatus = s.referralStatus === "Yes" ? "Yes" : "No";
			if (exists) {
				if (existingRows[0].phone !== cleanPhone) continue;
				finalStatus = existingRows[0].status;
				finalReferredBy = existingRows[0].referredBy;
				finalReferralStatus = existingRows[0].referralStatus;
			} else {
				const [phoneRows] = await connection.query("SELECT customerId FROM students WHERE phone = ?", [cleanPhone]);
				if (phoneRows.length > 0) continue;
				if (finalReferredBy) {
					const [referrerRows] = await connection.query("SELECT customerId FROM students WHERE customerId = ?", [finalReferredBy]);
					if (referrerRows.length === 0) finalReferredBy = null;
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
			await connection.query(`INSERT INTO students 
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
            isTempPin = VALUES(isTempPin)`, [
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
				s.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
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
				cleanIsTempPin
			]);
			if (!exists) {
				await sendSMS(cleanPhone, `Dear ${cleanName}, your URBAN WASH pickup order ${s.customerId} is confirmed. Pickup date: ${cleanDate || "Scheduled"}. Support: 0687771750.`);
				if (finalReferredBy) {
					const [refCountRows] = await connection.query("SELECT COUNT(*) as count FROM students WHERE referredBy = ?", [finalReferredBy]);
					if (refCountRows[0].count === 3) {
						const [referrerRows] = await connection.query("SELECT fullName, phone FROM students WHERE customerId = ?", [finalReferredBy]);
						const referrerList = referrerRows;
						if (referrerList.length > 0) {
							const referrer = referrerList[0];
							const rewardMsg = `Dear ${referrer.fullName}, you referred 3 students and unlocked a FREE WASH with URBAN WASH! WhatsApp 0687771750 to claim.`;
							await sendSMS(referrer.phone, rewardMsg);
						}
					}
				}
			}
		}
		const [allRows] = await connection.query("SELECT * FROM students");
		return {
			success: true,
			students: allRows.map((row) => ({
				customerId: row.customerId,
				fullName: row.fullName,
				phone: row.phone,
				whatsapp: row.whatsapp,
				hostel: row.hostel,
				room: row.room,
				services: JSON.parse(row.services || "[]"),
				offer: row.offer,
				referralStatus: row.referralStatus,
				referredBy: row.referredBy || void 0,
				consent: row.consent === 1,
				status: row.status,
				createdAt: row.createdAt,
				serviceSpeed: row.serviceSpeed || "Standard",
				leavingCampus: row.leavingCampus || void 0,
				pickupDate: row.pickupDate || void 0,
				pickupTimeSlot: row.pickupTimeSlot || void 0,
				pinCode: row.pinCode || void 0,
				paymentMethod: row.paymentMethod || void 0,
				paymentStatus: row.paymentStatus || "Pending",
				transactionCode: row.transactionCode || void 0,
				rating: typeof row.rating === "number" ? row.rating : void 0,
				ratingComment: row.ratingComment || void 0,
				isTempPin: row.isTempPin === 1,
				synced: true
			}))
		};
	} catch (err) {
		console.error("Clever Cloud MySQL database sync error:", err);
		throw err;
	} finally {
		connection.release();
	}
});
var updateStudentStatusFn_createServerFn_handler = createServerRpc({
	id: "d736a226007aca51d82c9b9d2b994e5caf3de76a203dd98f2bf61ae298454cd4",
	name: "updateStudentStatusFn",
	filename: "src/lib/db-server.ts"
}, (opts) => updateStudentStatusFn.__executeServer(opts));
var updateStudentStatusFn = createServerFn({ method: "POST" }).validator((data) => data).handler(updateStudentStatusFn_createServerFn_handler, async ({ data: { customerId, status, passcode } }) => {
	const securePasscode = process.env.ADMIN_PASSCODE || "donttrythis";
	if (!passcode || passcode !== securePasscode) throw new Error("Unauthorized: Invalid admin credentials");
	await initDb();
	const connection = await (await getPool()).getConnection();
	try {
		const [rows] = await connection.query("SELECT fullName, phone, status, hostel, room FROM students WHERE customerId = ?", [customerId]);
		const studentList = rows;
		if (studentList.length > 0) {
			const student = studentList[0];
			const oldStatus = student.status;
			await connection.query("UPDATE students SET status = ? WHERE customerId = ?", [status, customerId]);
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
var requestTempPinFn_createServerFn_handler = createServerRpc({
	id: "aacd6e0fc668b9f197fb589b0e2d69db7646f5e62bd16da19d4c91fd633acfa0",
	name: "requestTempPinFn",
	filename: "src/lib/db-server.ts"
}, (opts) => requestTempPinFn.__executeServer(opts));
var requestTempPinFn = createServerFn({ method: "POST" }).validator((phone) => phone).handler(requestTempPinFn_createServerFn_handler, async ({ data: rawPhone }) => {
	await initDb();
	const connection = await (await getPool()).getConnection();
	try {
		const clean = rawPhone.replace(/[^\d+]/g, "");
		const [rows] = await connection.query("SELECT * FROM students");
		const found = rows.find((s) => {
			const matchPhone = s.phone.replace(/[^\d+]/g, "").endsWith(clean.slice(-8)) || s.whatsapp.replace(/[^\d+]/g, "").endsWith(clean.slice(-8));
			return clean.length >= 6 && matchPhone;
		});
		if (!found) return {
			success: false,
			reason: "notFound"
		};
		const tempPin = Math.floor(1e3 + Math.random() * 9e3).toString();
		await connection.query("UPDATE students SET pinCode = ?, isTempPin = 1 WHERE customerId = ?", [tempPin, found.customerId]);
		const smsText = `Dear ${found.fullName}, your temporary URBAN WASH PIN is ${tempPin}. Log in with this PIN to set a new password. Support: 0687771750.`;
		await sendSMS(found.phone, smsText);
		return {
			success: true,
			customerId: found.customerId,
			tempPin
		};
	} catch (err) {
		console.error("requestTempPinFn error:", err);
		return {
			success: false,
			reason: "serverError"
		};
	} finally {
		connection.release();
	}
});
var verifyAdminPasscodeFn_createServerFn_handler = createServerRpc({
	id: "88de60bd1331c985d8e63eab3551aebb3bcb5b031adaf04c4bb8d6b87e2e00e3",
	name: "verifyAdminPasscodeFn",
	filename: "src/lib/db-server.ts"
}, (opts) => verifyAdminPasscodeFn.__executeServer(opts));
var verifyAdminPasscodeFn = createServerFn({ method: "POST" }).validator((passcode) => passcode).handler(verifyAdminPasscodeFn_createServerFn_handler, async ({ data: passcode }) => {
	return { success: passcode === (process.env.ADMIN_PASSCODE || "donttrythis") };
});
var deleteStudentFn_createServerFn_handler = createServerRpc({
	id: "e7865490e76a0860472b433edc72e4e689e9ee48666d409d6c02ce798f0fc644",
	name: "deleteStudentFn",
	filename: "src/lib/db-server.ts"
}, (opts) => deleteStudentFn.__executeServer(opts));
var deleteStudentFn = createServerFn({ method: "POST" }).validator((data) => data).handler(deleteStudentFn_createServerFn_handler, async ({ data: { customerId, passcode } }) => {
	await initDb();
	const connection = await (await getPool()).getConnection();
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
//#endregion
export { deleteStudentFn_createServerFn_handler, initDbFn_createServerFn_handler, requestTempPinFn_createServerFn_handler, syncStudentsFn_createServerFn_handler, updateStudentStatusFn_createServerFn_handler, verifyAdminPasscodeFn_createServerFn_handler };
