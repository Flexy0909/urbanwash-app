import { r as __toESM } from "../_runtime.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as getReferralCount, f as saveStudent, h as verifyAdminPasscodeFn, i as exportExcel, l as getReferralRewardStatus, m as updateStudentStatus, n as downloadFile, p as syncWithCloud, r as exportCSV, t as deleteStudent, u as loadStudents } from "./storage-Dnf1ak9H.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { C as MessageSquare, D as Lock, F as Copy, I as Clock, L as ClipboardList, M as Funnel, N as Download, S as PenLine, W as Award, _ as RotateCw, b as Printer, c as Trash2, g as Search, i as Users, m as ShieldAlert, n as X, s as TrendingUp, z as CircleCheckBig } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-Dytc6ZIt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var HOSTELS = [
	"Hostel 1",
	"Hostel 2",
	"Hostel 3",
	"Hostel 4"
];
var SERVICES = [
	"Washing",
	"Ironing",
	"Wash & Iron"
];
function Admin() {
	const [students, setStudents] = (0, import_react.useState)([]);
	const [syncStatus, setSyncStatus] = (0, import_react.useState)("idle");
	const [q, setQ] = (0, import_react.useState)("");
	const [hostelFilter, setHostelFilter] = (0, import_react.useState)("");
	const [serviceFilter, setServiceFilter] = (0, import_react.useState)("");
	const [referralFilter, setReferralFilter] = (0, import_react.useState)("");
	const [dateFilter, setDateFilter] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("");
	const [speedFilter, setSpeedFilter] = (0, import_react.useState)("");
	const [paymentFilter, setPaymentFilter] = (0, import_react.useState)("");
	const [isAuthenticated, setIsAuthenticated] = (0, import_react.useState)(false);
	const [passcode, setPasscode] = (0, import_react.useState)("");
	const [passcodeError, setPasscodeError] = (0, import_react.useState)("");
	const [unlocking, setUnlocking] = (0, import_react.useState)(false);
	const [waGroupFilter, setWaGroupFilter] = (0, import_react.useState)("All");
	const [waCopied, setWaCopied] = (0, import_react.useState)(false);
	const [activeTab, setActiveTab] = (0, import_react.useState)("orders");
	const [formResponses, setFormResponses] = (0, import_react.useState)([]);
	const [selectedStudentForVerification, setSelectedStudentForVerification] = (0, import_react.useState)(null);
	const [editingOrderItems, setEditingOrderItems] = (0, import_react.useState)([]);
	const [adminNotes, setAdminNotes] = (0, import_react.useState)("");
	const [customAddName, setCustomAddName] = (0, import_react.useState)("");
	const [customAddQty, setCustomAddQty] = (0, import_react.useState)(1);
	const [customAddService, setCustomAddService] = (0, import_react.useState)("Wash & Iron");
	const [customAddPrice, setCustomAddPrice] = (0, import_react.useState)(1e3);
	const [denyModalStudent, setDenyModalStudent] = (0, import_react.useState)(null);
	const [denialReasonInput, setDenialReasonInput] = (0, import_react.useState)("");
	const [editStudentModal, setEditStudentModal] = (0, import_react.useState)(null);
	const [editFullName, setEditFullName] = (0, import_react.useState)("");
	const [editPhone, setEditPhone] = (0, import_react.useState)("");
	const [editHostel, setEditHostel] = (0, import_react.useState)("");
	const [editRoom, setEditRoom] = (0, import_react.useState)("");
	const [deleteConfirmStudent, setDeleteConfirmStudent] = (0, import_react.useState)(null);
	const openEditStudentModal = (student) => {
		setEditStudentModal(student);
		setEditFullName(student.fullName);
		setEditPhone(student.phone);
		setEditHostel(student.hostel);
		setEditRoom(student.room);
	};
	const handleSaveStudentProfile = (e) => {
		e.preventDefault();
		if (!editStudentModal) return;
		const updated = {
			...editStudentModal,
			fullName: editFullName.trim(),
			phone: editPhone.trim(),
			hostel: editHostel.trim(),
			room: editRoom.trim()
		};
		saveStudent(updated);
		setStudents((prev) => prev.map((x) => x.customerId === updated.customerId ? updated : x));
		setEditStudentModal(null);
	};
	const handleConfirmDelete = () => {
		if (!deleteConfirmStudent) return;
		const cid = deleteConfirmStudent.customerId;
		deleteStudent(cid, passcode);
		setStudents((prev) => prev.filter((x) => x.customerId !== cid));
		setDeleteConfirmStudent(null);
	};
	const openVerificationModal = (student) => {
		setSelectedStudentForVerification(student);
		setEditingOrderItems(student.orderItems ? JSON.parse(JSON.stringify(student.orderItems)) : []);
		setAdminNotes(student.adminVerificationNotes || "");
	};
	const runSync = () => {
		setSyncStatus("syncing");
		syncWithCloud((merged) => {
			setStudents(merged);
			setSyncStatus("success");
			setTimeout(() => setSyncStatus("idle"), 2e3);
		}).catch((err) => {
			console.error(err);
			setSyncStatus("error");
			setStudents(loadStudents());
			setTimeout(() => setSyncStatus("idle"), 3e3);
		});
	};
	(0, import_react.useEffect)(() => {
		const auth = sessionStorage.getItem("urbanwash_admin_auth") === "true";
		setIsAuthenticated(auth);
		setStudents(loadStudents());
		if (auth) runSync();
	}, []);
	const handleUnlock = async (e) => {
		e.preventDefault();
		if (!passcode) return;
		setUnlocking(true);
		setPasscodeError("");
		try {
			if ((await verifyAdminPasscodeFn({ data: passcode })).success) {
				sessionStorage.setItem("urbanwash_admin_auth", "true");
				sessionStorage.setItem("urbanwash_admin_passcode", passcode);
				setIsAuthenticated(true);
				runSync();
			} else {
				setPasscodeError("Invalid passcode. Access Denied.");
				setPasscode("");
			}
		} catch (err) {
			console.error("Passcode check failed:", err);
			setPasscodeError("Server error. Please try again.");
		} finally {
			setUnlocking(false);
		}
	};
	const handleStatusChange = (customerId, newStatus) => {
		updateStudentStatus(customerId, newStatus);
		setStudents(loadStudents());
	};
	const stats = (0, import_react.useMemo)(() => {
		const today = (/* @__PURE__ */ new Date()).toDateString();
		const total = students.length;
		const activeCustomers = students.filter((s) => s.status === "First Order Completed" || s.status === "Repeat Customer" || s.status === "VIP Customer").length;
		const conversionRate = total > 0 ? (activeCustomers / total * 100).toFixed(1) : "0.0";
		const h1 = students.filter((s) => s.hostel === "Hostel 1").length;
		const h2 = students.filter((s) => s.hostel === "Hostel 2").length;
		const h3 = students.filter((s) => s.hostel === "Hostel 3").length;
		const h4 = students.filter((s) => s.hostel === "Hostel 4").length;
		const mostPopularHostel = [
			{
				name: "Hostel 1",
				count: h1
			},
			{
				name: "Hostel 2",
				count: h2
			},
			{
				name: "Hostel 3",
				count: h3
			},
			{
				name: "Hostel 4",
				count: h4
			}
		].sort((a, b) => b.count - a.count)[0];
		const washing = students.filter((s) => s.services.includes("Washing")).length;
		const ironing = students.filter((s) => s.services.includes("Ironing")).length;
		const washIron = students.filter((s) => s.services.includes("Wash & Iron")).length;
		const mostPopularService = [
			{
				name: "Washing",
				count: washing
			},
			{
				name: "Ironing",
				count: ironing
			},
			{
				name: "Wash & Iron",
				count: washIron
			}
		].sort((a, b) => b.count - a.count)[0];
		const referralsJoined = students.filter((s) => s.referralStatus === "Yes").length;
		const totalReferralLeads = students.filter((s) => s.referredBy).length;
		const rewardsEarnedCount = students.filter((s) => getReferralCount(s.customerId, students) >= 3).length;
		const expressCount = students.filter((s) => s.serviceSpeed === "Express").length;
		return {
			total,
			today: students.filter((s) => new Date(s.createdAt).toDateString() === today).length,
			referralMembers: referralsJoined,
			totalReferralLeads,
			rewardsEarned: rewardsEarnedCount,
			conversionRate,
			mostPopularHostel: total > 0 ? mostPopularHostel.name : "None",
			mostPopularService: total > 0 ? mostPopularService.name : "None",
			firstOrders: students.filter((s) => s.status === "First Order Completed").length,
			repeatCustomers: students.filter((s) => s.status === "Repeat Customer").length,
			washing,
			ironing,
			washIron,
			expressCount,
			h1,
			h2,
			h3,
			h4
		};
	}, [students]);
	const leaderboard = (0, import_react.useMemo)(() => {
		return students.filter((s) => s.referralStatus === "Yes").map((s) => ({
			student: s,
			count: getReferralCount(s.customerId, students),
			rewardStatus: getReferralRewardStatus(s.customerId, students)
		})).sort((a, b) => b.count - a.count).slice(0, 5);
	}, [students]);
	const nearThreshold = (0, import_react.useMemo)(() => {
		return students.filter((s) => s.referralStatus === "Yes").map((s) => ({
			student: s,
			count: getReferralCount(s.customerId, students)
		})).filter((item) => item.count === 1 || item.count === 2).sort((a, b) => b.count - a.count);
	}, [students]);
	const filtered = (0, import_react.useMemo)(() => {
		return students.filter((s) => {
			if (q) {
				const query = q.toLowerCase();
				if (!(s.fullName.toLowerCase().includes(query) || s.phone.includes(query) || s.customerId.toLowerCase().includes(query))) return false;
			}
			if (hostelFilter && s.hostel !== hostelFilter) return false;
			if (serviceFilter && !s.services.includes(serviceFilter)) return false;
			if (referralFilter && s.referralStatus !== referralFilter) return false;
			if (statusFilter && s.status !== statusFilter) return false;
			if (speedFilter && s.serviceSpeed !== speedFilter) return false;
			if (paymentFilter && (s.paymentStatus || "Pending") !== paymentFilter) return false;
			if (dateFilter) {
				if (new Date(s.createdAt).toISOString().split("T")[0] !== dateFilter) return false;
			}
			return true;
		});
	}, [
		students,
		q,
		hostelFilter,
		serviceFilter,
		referralFilter,
		statusFilter,
		dateFilter,
		speedFilter,
		paymentFilter
	]);
	const whatsappBroadcastData = (0, import_react.useMemo)(() => {
		let list = students;
		if (waGroupFilter === "Hostel 1") list = students.filter((s) => s.hostel === "Hostel 1");
		else if (waGroupFilter === "Hostel 2") list = students.filter((s) => s.hostel === "Hostel 2");
		else if (waGroupFilter === "Hostel 3") list = students.filter((s) => s.hostel === "Hostel 3");
		else if (waGroupFilter === "Hostel 4") list = students.filter((s) => s.hostel === "Hostel 4");
		else if (waGroupFilter === "Washing") list = students.filter((s) => s.services.includes("Washing"));
		else if (waGroupFilter === "Ironing") list = students.filter((s) => s.services.includes("Ironing"));
		else if (waGroupFilter === "Wash & Iron") list = students.filter((s) => s.services.includes("Wash & Iron"));
		else if (waGroupFilter === "Referral Members") list = students.filter((s) => s.referralStatus === "Yes");
		return list.map((s) => s.whatsapp || s.phone).join(", ");
	}, [students, waGroupFilter]);
	const copyBroadcastPhones = () => {
		if (!whatsappBroadcastData) return;
		navigator.clipboard.writeText(whatsappBroadcastData);
		setWaCopied(true);
		setTimeout(() => setWaCopied(false), 2e3);
	};
	if (!isAuthenticated) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-slate-900 flex items-center justify-center p-4 select-none relative overflow-hidden font-sans",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-[-100px] left-[-100px] w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-md bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl relative z-10 text-center space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-16 w-16 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded-2xl flex items-center justify-center shadow-inner",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-8 w-8" })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-2xl font-black text-white tracking-tight",
							children: "Admin Portal"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-400",
							children: "Only authorized URBAN WASH administrators are permitted access."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleUnlock,
						className: "space-y-4 text-left",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "passcode",
								className: "text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5",
								children: "Passcode / Password"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "passcode",
								type: "password",
								placeholder: "••••••••",
								value: passcode,
								onChange: (e) => {
									setPasscode(e.target.value);
									if (passcodeError) setPasscodeError("");
								},
								className: `w-full text-sm bg-slate-950 text-white px-4 py-3.5 rounded-2xl border ${passcodeError ? "border-rose-500 focus:ring-rose-500/20" : "border-slate-700 focus:border-blue-500 focus:ring-blue-500/20"} focus:outline-none focus:ring-4 transition`,
								autoFocus: true
							}),
							passcodeError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-rose-400 text-xs mt-1.5 font-medium flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-3.5 w-3.5" }), passcodeError]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: unlocking || !passcode,
							className: "w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl shadow-lg transition duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-95",
							children: unlocking ? "Verifying..." : "Unlock Dashboard"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-4 border-t border-slate-700/50 flex items-center justify-center gap-1 text-[10px] text-slate-500 font-medium",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Unauthorized access is strictly prohibited and logged." })]
					})
				]
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-slate-50 text-slate-800 font-sans pb-12 selection:bg-blue-500 selection:text-white",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "border-b border-blue-800/40 bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 text-white sticky top-0 z-20 shadow-md",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-7xl px-4 py-3 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-center gap-2 group",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/urban-logo-v2.jpg",
						alt: "Urban Wash Connect",
						className: "h-14 sm:h-16 w-auto drop-shadow-md rounded-lg group-hover:scale-105 transition duration-300 bg-white/10 p-1"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-blue-200 font-bold",
						children: "| Management & Analytics"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								sessionStorage.removeItem("urbanwash_admin_auth");
								sessionStorage.removeItem("urbanwash_admin_passcode");
								setIsAuthenticated(false);
							},
							className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200 hover:border-rose-300 text-xs font-semibold text-rose-600 bg-rose-50/50 hover:bg-rose-50 cursor-pointer active:scale-95 transition",
							children: "Log Out"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: runSync,
							disabled: syncStatus === "syncing",
							className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 text-xs font-semibold text-slate-600 bg-white cursor-pointer active:scale-95 transition disabled:opacity-60",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCw, { className: `h-3.5 w-3.5 ${syncStatus === "syncing" ? "animate-spin text-blue-600" : ""}` }), syncStatus === "syncing" ? "Syncing Cloud..." : "Sync Database"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: "/print-qr.html",
							target: "_blank",
							rel: "noopener noreferrer",
							className: "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-700 bg-white cursor-pointer active:scale-95 transition",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "h-3.5 w-3.5 text-slate-500" }), "Print Poster"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/register",
							className: "bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-sm transition",
							children: "+ Register Lead"
						})
					]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-7xl px-4 mt-6 space-y-6",
			children: [
				syncStatus === "success" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-fade-in",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "h-4 w-4 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Success: Cloud database synced. Merged local records with remote campaign registrations!" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "md:flex md:items-center md:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl font-black text-slate-900 tracking-tight",
						children: "Campaign Analytics"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-500 mt-1",
						children: "Real-time student registration metrics, viral growth leaderboards, and WhatsApp marketing filters."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 md:mt-0 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => downloadFile(`urbanwash-export-${Date.now()}.csv`, exportCSV(filtered, students), "text/csv"),
							className: "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-xs font-semibold text-slate-700 shadow-sm transition cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" }), "Export CSV"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => downloadFile(`urbanwash-export-${Date.now()}.xls`, exportExcel(filtered, students), "application/vnd.ms-excel"),
							className: "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" }), "Export Excel (xls)"]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Total Registrations",
							value: stats.total,
							highlight: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Today's Leads",
							value: stats.today,
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4 text-amber-500" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Referral Members",
							value: stats.referralMembers,
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4 text-blue-500" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Successful Referrals",
							value: stats.totalReferralLeads,
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-4 w-4 text-emerald-500" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Rewards Earned",
							value: stats.rewardsEarned,
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "h-4 w-4 text-indigo-500" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Conversion Funnel",
							value: `${stats.conversionRate}%`,
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "h-4 w-4 text-teal-500" })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Most Popular Hostel",
							value: stats.mostPopularHostel,
							textOnly: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Most Popular Service",
							value: stats.mostPopularService,
							textOnly: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "First Orders",
							value: stats.firstOrders
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Repeat Customers",
							value: stats.repeatCustomers
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Washing Leads",
							value: stats.washing
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Wash & Iron Leads",
							value: stats.washIron
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Express Speed Leads",
							value: stats.expressCount
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid lg:grid-cols-3 gap-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between pb-2 border-b border-slate-50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "font-black text-slate-800 text-sm flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "h-4.5 w-4.5 text-blue-500" }), "Referral Leaderboard"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full",
									children: "Top"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "divide-y divide-slate-100",
								children: leaderboard.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-slate-400 py-6 text-center",
									children: "No referrers active yet."
								}) : leaderboard.map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "py-2.5 flex items-center justify-between text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-bold text-slate-400",
											children: ["#", idx + 1]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-bold text-slate-700",
											children: item.student.fullName
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[10px] font-mono text-slate-400",
											children: [
												item.student.customerId,
												" • ",
												item.student.hostel
											]
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-right",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-extrabold text-blue-600 block",
											children: [item.count, " Referrals"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: `text-[9px] font-bold ${item.rewardStatus === "Unlocked" ? "text-emerald-500" : "text-amber-500"}`,
											children: ["Reward: ", item.rewardStatus]
										})]
									})]
								}, item.student.customerId))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between pb-2 border-b border-slate-50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "font-black text-slate-800 text-sm flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "h-4.5 w-4.5 text-amber-500" }), "Near Reward (1-2 Referrals)"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded-full",
									children: "Target"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "divide-y divide-slate-100 overflow-y-auto max-h-[220px]",
								children: nearThreshold.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-slate-400 py-6 text-center",
									children: "No students close to thresholds."
								}) : nearThreshold.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "py-2.5 flex items-center justify-between text-xs animate-fade-in",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-bold text-slate-700",
										children: item.student.fullName
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[10px] font-mono text-slate-400",
										children: [
											item.student.customerId,
											" • ",
											item.student.hostel
										]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-right font-semibold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100",
										children: [item.count, " / 3 Ref"]
									})]
								}, item.student.customerId))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between pb-2 border-b border-slate-50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "font-black text-slate-800 text-sm flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "h-4.5 w-4.5 text-emerald-500" }), "WhatsApp Broadcast Hub"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full",
									children: "Labels"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-slate-500 leading-relaxed",
										children: "Filter phone numbers by hostel or service label to create a comma-separated list for WhatsApp Broadcast lists."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1",
										children: "Select Contact Label"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: waGroupFilter,
										onChange: (e) => setWaGroupFilter(e.target.value),
										className: "w-full text-xs px-2.5 py-2 rounded-xl border border-slate-200 bg-white",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "All",
												children: "All Contacts"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Hostel 1",
												children: "Hostel 1 Students"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Hostel 2",
												children: "Hostel 2 Students"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Hostel 3",
												children: "Hostel 3 Students"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Hostel 4",
												children: "Hostel 4 Students"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Washing",
												children: "Washing Customers"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Ironing",
												children: "Ironing Customers"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Wash & Iron",
												children: "Wash & Iron Customers"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Referral Members",
												children: "Referral Program Members"
											})
										]
									})] }),
									whatsappBroadcastData ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "bg-slate-50 p-3 rounded-xl border border-slate-100 max-h-[80px] overflow-y-auto font-mono text-[10px] break-all select-all shadow-inner text-slate-500",
										children: whatsappBroadcastData
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-slate-400 italic text-center py-2",
										children: "No phone numbers in this group."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: copyBroadcastPhones,
										disabled: !whatsappBroadcastData,
										className: "w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5" }), waCopied ? "Phone Numbers Copied!" : `Copy Group (${waGroupFilter})`]
									})
								]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "md:flex md:items-center md:justify-between pb-3 border-b border-slate-100 gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "font-black text-slate-900 text-base flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, { className: "h-5 w-5 text-blue-500" }), "Customer Leads Table"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 md:mt-0 relative max-w-xs w-full",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-2.5 h-4 w-4 text-slate-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									placeholder: "Search name, phone, or ID...",
									value: q,
									onChange: (e) => setQ(e.target.value),
									className: "w-full text-xs pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-100 transition"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 bg-slate-50 rounded-2xl border border-slate-100/50 flex flex-wrap gap-2 items-center text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-bold text-slate-500 flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "h-3.5 w-3.5" }), "Filters:"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: hostelFilter,
									onChange: (e) => setHostelFilter(e.target.value),
									className: "px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "All Hostels"
									}), HOSTELS.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: h }, h))]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: serviceFilter,
									onChange: (e) => setServiceFilter(e.target.value),
									className: "px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "All Service Interests"
									}), SERVICES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: s }, s))]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: referralFilter,
									onChange: (e) => setReferralFilter(e.target.value),
									className: "px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "",
											children: "All Referral Programs"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Yes",
											children: "Yes (Member)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "No",
											children: "No (Non-Member)"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: statusFilter,
									onChange: (e) => setStatusFilter(e.target.value),
									className: "px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "",
											children: "All Journey Status"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Lead Registered",
											children: "Lead Registered"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Contacted",
											children: "Contacted"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "First Order Completed",
											children: "First Order Completed"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Repeat Customer",
											children: "Repeat Customer"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Referral Customer",
											children: "Referral Customer"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "VIP Customer",
											children: "VIP Customer"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: speedFilter,
									onChange: (e) => setSpeedFilter(e.target.value),
									className: "px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "",
											children: "All Speeds"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Standard",
											children: "Standard (48-72h)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Express",
											children: "Express (up to 4h)"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: paymentFilter,
									onChange: (e) => setPaymentFilter(e.target.value),
									className: "px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-semibold text-slate-700",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "",
											children: "All Payment Statuses"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Pending",
											children: "Pending Payment"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Verification Submitted",
											children: "Verification Submitted"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Paid",
											children: "Paid & Confirmed"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "date",
									value: dateFilter,
									onChange: (e) => setDateFilter(e.target.value),
									className: "px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600"
								}),
								(hostelFilter || serviceFilter || referralFilter || statusFilter || dateFilter || speedFilter || paymentFilter || q) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => {
										setHostelFilter("");
										setServiceFilter("");
										setReferralFilter("");
										setStatusFilter("");
										setDateFilter("");
										setSpeedFilter("");
										setPaymentFilter("");
										setQ("");
									},
									className: "text-blue-600 hover:underline font-bold py-1 px-2.5 cursor-pointer ml-auto",
									children: "Clear Filters"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-x-auto rounded-xl border border-slate-100 shadow-sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-xs text-left border-collapse bg-white",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3.5",
											children: "Customer & Order ID"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3.5",
											children: "Full Name"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3.5",
											children: "Phone Details"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3.5",
											children: "Hostel & Room"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3.5",
											children: "Order Clothes & Pricing"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3.5",
											children: "Payment Status"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3.5",
											children: "Journey Status (Edit)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3.5",
											children: "Speed"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3.5",
											children: "Date"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3.5 text-center",
											children: "Actions"
										})
									]
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
									className: "divide-y divide-slate-100",
									children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										colSpan: 10,
										className: "p-12 text-center text-slate-400 italic",
										children: "No matching registered student records found."
									}) }) : filtered.map((s) => {
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "hover:bg-slate-50/50 transition",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
													className: "p-3.5 font-mono text-slate-900 whitespace-nowrap",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "font-extrabold text-blue-900",
															children: s.customerId
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "text-[10px] text-amber-700 font-black mt-0.5",
															children: s.orderId || `ORD-2026-${s.customerId.slice(-4)}`
														}),
														s.synced === false && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "ml-1 inline-block h-2 w-2 rounded-full bg-amber-500",
															title: "Unsynced changes"
														})
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-3.5 font-semibold text-slate-800 whitespace-nowrap",
													children: s.fullName
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
													className: "p-3.5 text-slate-500 whitespace-nowrap space-y-0.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["📱 ", s.phone] }), s.whatsapp && s.whatsapp !== s.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "text-emerald-600 font-medium",
														children: ["💬 ", s.whatsapp]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
													className: "p-3.5 text-slate-700 whitespace-nowrap font-medium",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "block",
														children: s.hostel
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-[10px] text-slate-400 font-mono",
														children: ["Room: ", s.room]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-3.5 whitespace-nowrap",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "space-y-1",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: `text-[10px] font-extrabold px-2 py-0.5 rounded-full border inline-block ${s.adminVerified ? "bg-emerald-50 text-emerald-800 border-emerald-300" : "bg-amber-50 text-amber-800 border-amber-300"}`,
																children: s.adminVerified ? "✅ Verified at Pickup" : "⏳ Pending Verification"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
																className: "text-[11px] font-bold text-slate-800",
																children: ["Total: ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																	className: "font-mono text-blue-700 font-black",
																	children: [
																		"TShs ",
																		(s.adminConfirmedTotal || s.estimatedTotal || 0).toLocaleString(),
																		"/="
																	]
																})]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
																onClick: () => openVerificationModal(s),
																className: "text-[10px] bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold px-2.5 py-1 rounded-lg shadow transition cursor-pointer flex items-center gap-1",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, { className: "h-3 w-3" }), "Verify Clothes & Prices"]
															})
														]
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-3.5 whitespace-nowrap",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "space-y-1",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: `text-[10px] font-extrabold px-2 py-0.5 rounded-full border block w-max ${s.paymentStatus === "Paid" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : s.paymentStatus === "Denied" ? "bg-rose-50 text-rose-700 border-rose-200" : s.paymentStatus === "Verification Submitted" ? "bg-amber-50 text-amber-800 border-amber-200" : "bg-slate-100 text-slate-600 border-slate-200"}`,
																children: s.paymentStatus || "Pending"
															}),
															s.transactionCode && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
																className: "text-[10px] font-mono font-bold text-slate-800",
																children: [
																	s.transactionCode,
																	" (",
																	s.paymentMethod || "Mobile Money",
																	")"
																]
															}),
															s.paymentStatus === "Denied" && s.paymentDenialReason && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
																className: "text-[9px] text-rose-600 font-semibold max-w-[150px] truncate",
																title: s.paymentDenialReason,
																children: ["Reason: ", s.paymentDenialReason]
															}),
															s.paymentStatus !== "Paid" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "flex items-center gap-1 pt-1",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																	onClick: () => {
																		const updated = {
																			...s,
																			paymentStatus: "Paid",
																			paymentDenialReason: void 0
																		};
																		saveStudent(updated);
																		setStudents((prev) => prev.map((x) => x.customerId === s.customerId ? updated : x));
																	},
																	className: "text-[9px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2 py-0.5 rounded shadow-xs cursor-pointer transition",
																	children: "✓ Verify"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																	onClick: () => {
																		setDenyModalStudent(s);
																		setDenialReasonInput(s.paymentDenialReason || "Invalid or unverified transaction code. Please check your M-Pesa SMS.");
																	},
																	className: "text-[9px] bg-rose-600 hover:bg-rose-700 text-white font-bold px-2 py-0.5 rounded shadow-xs cursor-pointer transition",
																	children: "✖ Deny"
																})]
															})
														]
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-3.5 whitespace-nowrap",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
														value: s.status,
														onChange: (e) => handleStatusChange(s.customerId, e.target.value),
														className: `px-2 py-1 rounded-lg border text-[11px] font-bold cursor-pointer transition ${s.status === "VIP Customer" ? "bg-purple-50 text-purple-700 border-purple-200" : s.status === "Picked Up & Verified" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : s.status === "Washing & Drying" ? "bg-blue-50 text-blue-700 border-blue-200" : s.status === "Ready for Delivery" ? "bg-teal-50 text-teal-700 border-teal-200" : "bg-slate-100 text-slate-700 border-slate-200"}`,
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																value: "Lead Registered",
																children: "Lead Registered"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																value: "Contacted",
																children: "Contacted"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																value: "Picked Up & Verified",
																children: "Picked Up & Verified"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																value: "Washing & Drying",
																children: "Washing & Drying"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																value: "Ready for Delivery",
																children: "Ready for Delivery"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																value: "First Order Completed",
																children: "First Order Completed"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																value: "Repeat Customer",
																children: "Repeat Customer"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																value: "VIP Customer",
																children: "VIP Customer"
															})
														]
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-3.5 whitespace-nowrap",
													children: s.serviceSpeed === "Express" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-extrabold px-2 py-0.5 rounded-full animate-pulse shadow-sm",
														children: "⚡ Express"
													}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "inline-flex items-center gap-1 bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full",
														children: "⏱️ Standard"
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-3.5 text-slate-400 whitespace-nowrap",
													children: new Date(s.createdAt).toLocaleDateString()
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-3.5 whitespace-nowrap text-center",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center justify-center gap-1.5",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															onClick: () => openEditStudentModal(s),
															className: "p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg border border-blue-200 transition cursor-pointer shadow-2xs",
															title: "Edit Student Info",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "h-3.5 w-3.5" })
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															onClick: () => setDeleteConfirmStudent(s),
															className: "p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg border border-rose-200 transition cursor-pointer shadow-2xs",
															title: "Delete Student Record",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
														})]
													})
												})
											]
										}, s.customerId);
									})
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-2 text-[10px] text-slate-400 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"Showing ",
								filtered.length,
								" of ",
								students.length,
								" campaign registration leads."
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "💡 Orange dot next to Customer ID indicates local modifications pending cloud sync." })]
						})
					]
				}),
				denyModalStudent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white rounded-3xl p-6 max-w-md w-full border border-slate-100 shadow-2xl space-y-4 animate-scale-up",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between border-b border-slate-100 pb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 text-rose-700",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-5 w-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-black text-base",
										children: "Deny Payment Verification"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setDenyModalStudent(null),
									className: "p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-slate-600",
										children: [
											"Denying payment verification for ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: denyModalStudent.fullName }),
											" (",
											denyModalStudent.customerId,
											")."
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-slate-400",
										children: "Please specify the exact reason so the student can re-enter a valid M-Pesa / Airtel Money transaction code."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pt-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-xs font-bold text-slate-700 mb-1",
											children: "Reason for Denial:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											rows: 3,
											value: denialReasonInput,
											onChange: (e) => setDenialReasonInput(e.target.value),
											placeholder: "e.g. Transaction code not found or amount does not match.",
											className: "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-end gap-2 pt-2 border-t border-slate-100",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setDenyModalStudent(null),
									className: "px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => {
										if (!denialReasonInput.trim()) return;
										const updated = {
											...denyModalStudent,
											paymentStatus: "Denied",
											paymentDenialReason: denialReasonInput.trim()
										};
										saveStudent(updated);
										setStudents((prev) => prev.map((x) => x.customerId === denyModalStudent.customerId ? updated : x));
										setDenyModalStudent(null);
									},
									className: "px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md transition",
									children: "Confirm Denial"
								})]
							})
						]
					})
				}),
				editStudentModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b border-slate-100 pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "h-5 w-5 text-blue-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-extrabold text-base text-slate-900",
									children: "Edit Student Info"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setEditStudentModal(null),
								className: "text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleSaveStudentProfile,
							className: "space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold text-slate-700 mb-1",
									children: "Full Name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: editFullName,
									onChange: (e) => setEditFullName(e.target.value),
									className: "w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500",
									required: true
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold text-slate-700 mb-1",
									children: "Phone Number"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "tel",
									value: editPhone,
									onChange: (e) => setEditPhone(e.target.value),
									className: "w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500",
									required: true
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-bold text-slate-700 mb-1",
										children: "Hostel"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										value: editHostel,
										onChange: (e) => setEditHostel(e.target.value),
										className: "w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white",
										children: HOSTELS.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: h,
											children: h
										}, h))
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-bold text-slate-700 mb-1",
										children: "Room Number"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: editRoom,
										onChange: (e) => setEditRoom(e.target.value),
										className: "w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500",
										required: true
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-end gap-2 pt-3 border-t border-slate-100",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setEditStudentModal(null),
										className: "px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition",
										children: "Cancel"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "submit",
										className: "px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md transition",
										children: "Save Changes"
									})]
								})
							]
						})]
					})
				}),
				deleteConfirmStudent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 text-rose-600",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-10 w-10 rounded-2xl bg-rose-100 flex items-center justify-center font-bold",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-5 w-5 text-rose-600" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-extrabold text-base text-slate-900",
									children: "Delete Student Record?"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-slate-500",
									children: "This action cannot be undone."
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-slate-600 leading-relaxed bg-rose-50 border border-rose-100 p-3 rounded-2xl",
								children: [
									"Are you sure you want to permanently delete ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: deleteConfirmStudent.fullName }),
									" (",
									deleteConfirmStudent.customerId,
									")? This will remove their record from both local database and cloud storage."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-end gap-2 pt-2 border-t border-slate-100",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setDeleteConfirmStudent(null),
									className: "px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: handleConfirmDelete,
									className: "px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" }), "Permanently Delete"]
								})]
							})
						]
					})
				})
			]
		})]
	});
}
function StatCard({ label, value, highlight, textOnly, icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `rounded-2xl p-4 border shadow-sm ${highlight ? "bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-transparent" : "bg-white border-slate-100"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: `text-[10px] uppercase font-bold tracking-wider ${highlight ? "text-blue-100" : "text-slate-400"}`,
				children: label
			}), icon && !highlight && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: icon })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `mt-2 font-black tracking-tight ${textOnly ? "text-sm sm:text-base truncate text-slate-800" : highlight ? "text-2xl sm:text-3xl text-white" : "text-2xl sm:text-3xl text-slate-800"}`,
			children: value
		})]
	});
}
//#endregion
export { Admin as component };
