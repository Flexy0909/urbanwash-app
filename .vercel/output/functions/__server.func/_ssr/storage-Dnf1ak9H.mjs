import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-B2UczSEe.mjs";
import { i as TSS_SERVER_FUNCTION, l as createServerFn } from "./esm-Dova13aH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/storage-Dnf1ak9H.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
createServerFn({ method: "GET" }).handler(createSsrRpc("54d70ed88108a51fa8b0937945c76d00d57555b66db04e17e04b28aaf5188370"));
var syncStudentsFn = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("b999ba7cab68cd4c85afacfae01e4742a5bb6c11c9a16fdbc426b55396af3798"));
var updateStudentStatusFn = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("d736a226007aca51d82c9b9d2b994e5caf3de76a203dd98f2bf61ae298454cd4"));
var requestTempPinFn = createServerFn({ method: "POST" }).validator((phone) => phone).handler(createSsrRpc("aacd6e0fc668b9f197fb589b0e2d69db7646f5e62bd16da19d4c91fd633acfa0"));
var verifyAdminPasscodeFn = createServerFn({ method: "POST" }).validator((passcode) => passcode).handler(createSsrRpc("88de60bd1331c985d8e63eab3551aebb3bcb5b031adaf04c4bb8d6b87e2e00e3"));
var deleteStudentFn = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("e7865490e76a0860472b433edc72e4e689e9ee48666d409d6c02ce798f0fc644"));
var ITEM_PRICING = {
	"Shirt / T-Shirt": {
		"Wash & Fold": 500,
		"Iron Only": 500,
		"Wash & Iron": 1e3
	},
	"Suruali (Trousers/Jeans)": {
		"Wash & Fold": 500,
		"Iron Only": 500,
		"Wash & Iron": 1e3
	},
	"Shuka (Bed Sheet)": {
		"Wash & Fold": 1e3,
		"Iron Only": 500,
		"Wash & Iron": 1500
	},
	"Kanzu": {
		"Wash & Fold": 1e3,
		"Iron Only": 500,
		"Wash & Iron": 1500
	},
	"Taulo (Towel)": {
		"Wash & Fold": 1e3,
		"Iron Only": 500,
		"Wash & Iron": 1500
	},
	"Sweta / Hoodie": {
		"Wash & Fold": 1e3,
		"Iron Only": 500,
		"Wash & Iron": 1500
	},
	"Lab Coat": {
		"Wash & Fold": 1e3,
		"Iron Only": 500,
		"Wash & Iron": 1500
	},
	"Blanket / Duvet": {
		"Wash & Fold": 5e3,
		"Iron Only": 500,
		"Wash & Iron": 5500
	}
};
function getItemUnitPrice(itemName, serviceType, isExpress = false) {
	const stdPrice = ITEM_PRICING[itemName]?.[serviceType] || 0;
	if (!isExpress) return stdPrice;
	if (itemName === "Blanket / Duvet") return stdPrice + 2500;
	if (stdPrice <= 500) return stdPrice + 500;
	return stdPrice + 500;
}
var DEFAULT_SEED_STUDENTS = [
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
		synced: true
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
		estimatedTotal: 6e3,
		synced: true
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
		synced: true
	}
];
var KEY = "urbanwash_students_v1";
function loadStudents() {
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
function saveStudent(s) {
	const all = loadStudents();
	const index = all.findIndex((x) => x.customerId === s.customerId);
	const updatedStudent = {
		...s,
		synced: false
	};
	if (index >= 0) all[index] = updatedStudent;
	else all.push(updatedStudent);
	localStorage.setItem(KEY, JSON.stringify(all));
	syncWithCloud().catch((err) => {
		console.error("Background sync failed after saving student:", err);
	});
}
function updateStudentStatus(customerId, status, passcode) {
	const all = loadStudents();
	const student = all.find((x) => x.customerId === customerId);
	if (student) {
		student.status = status;
		student.synced = false;
		localStorage.setItem(KEY, JSON.stringify(all));
		updateStudentStatusFn({ data: {
			customerId,
			status,
			passcode: passcode || (typeof window !== "undefined" ? sessionStorage.getItem("urbanwash_admin_passcode") || "" : "")
		} }).then(() => {
			const currentLocal = loadStudents();
			const found = currentLocal.find((x) => x.customerId === customerId);
			if (found) {
				found.synced = true;
				localStorage.setItem(KEY, JSON.stringify(currentLocal));
			}
		}).catch((err) => {
			console.error("Failed to update status in cloud MySQL database:", err);
		});
	}
}
function deleteStudent(customerId, passcode) {
	const filtered = loadStudents().filter((x) => x.customerId !== customerId);
	localStorage.setItem(KEY, JSON.stringify(filtered));
	deleteStudentFn({ data: {
		customerId,
		passcode: passcode || (typeof window !== "undefined" ? sessionStorage.getItem("urbanwash_admin_passcode") || "" : "")
	} }).catch((err) => {
		console.error("Cloud delete student failed:", err);
	});
}
function generateCustomerId() {
	const year = (/* @__PURE__ */ new Date()).getFullYear();
	const count = loadStudents().length + 1;
	return `UW-${year}-${String(count).padStart(4, "0")}`;
}
function generateOrderId() {
	return `ORD-${(/* @__PURE__ */ new Date()).getFullYear()}-${Math.floor(1e3 + Math.random() * 9e3)}`;
}
async function syncWithCloud(onSyncComplete) {
	const unsynced = loadStudents().filter((s) => s.synced === false);
	try {
		const response = await syncStudentsFn({ data: unsynced });
		if (response && response.success && response.students) {
			const cloudStudents = response.students;
			const currentLocal = loadStudents();
			const localMap = new Map(currentLocal.map((s) => [s.customerId, s]));
			cloudStudents.forEach((cs) => {
				const localRecord = localMap.get(cs.customerId);
				if (!localRecord) localMap.set(cs.customerId, {
					...cs,
					synced: true
				});
				else localMap.set(cs.customerId, {
					...localRecord,
					...cs,
					synced: true
				});
			});
			const merged = Array.from(localMap.values()).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
			localStorage.setItem(KEY, JSON.stringify(merged));
			if (onSyncComplete) onSyncComplete(merged);
			return merged;
		} else throw new Error("Invalid sync response structure");
	} catch (err) {
		console.error("Cloud database sync error:", err);
		throw err;
	}
}
function getReferralCount(customerId, all) {
	return all.filter((s) => s.referredBy === customerId).length;
}
function getReferralRewardStatus(customerId, all) {
	return getReferralCount(customerId, all) >= 3 ? "Unlocked" : "Pending";
}
function exportCSV(students, allStudents) {
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
		"Registration Date"
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
			new Date(s.createdAt).toLocaleString()
		].map((v) => `"${String(v).replace(/"/g, "\"\"")}"`).join(",");
	});
	return [headers.join(","), ...rows].join("\n");
}
function exportExcel(students, allStudents) {
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
        <tr><td colspan="16" class="title">URBAN WASH Student Registrations Campaign</td></tr>
        <tr><td colspan="16" class="meta">Generated on ${(/* @__PURE__ */ new Date()).toLocaleDateString()} | Total Records: ${students.length}</td></tr>
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
function downloadFile(name, content, type) {
	const blob = new Blob([content], { type });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = name;
	a.click();
	URL.revokeObjectURL(url);
}
//#endregion
export { generateCustomerId as a, getReferralCount as c, requestTempPinFn as d, saveStudent as f, verifyAdminPasscodeFn as h, exportExcel as i, getReferralRewardStatus as l, updateStudentStatus as m, downloadFile as n, generateOrderId as o, syncWithCloud as p, exportCSV as r, getItemUnitPrice as s, deleteStudent as t, loadStudents as u };
