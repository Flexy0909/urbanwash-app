import { r as __toESM } from "../_runtime.mjs";
import { _ as useNavigate, g as Link, v as useSearch } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as generateCustomerId, f as saveStudent, o as generateOrderId, p as syncWithCloud, s as getItemUnitPrice, u as loadStudents } from "./storage-Dnf1ak9H.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { B as CircleAlert, C as MessageSquare, D as Lock, H as Calendar, I as Clock, R as CircleCheck, U as CalendarCheck, a as User, j as Gift, k as House, l as SquareCheckBig, u as Sparkles, v as RefreshCw, x as Phone } from "../_libs/lucide-react.mjs";
import { n as Navbar, t as Footer } from "./Navbar-Cy8W0WK2.mjs";
import { a as stringType, i as objectType, n as enumType, r as literalType, t as arrayType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/register-DZ0upXtG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var phoneRe = /^(\+255[67]\d{8}|0[67]\d{8})$/;
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
function Register() {
	const navigate = useNavigate();
	const search = useSearch({ from: "/register" });
	const refFromUrl = search.ref || "";
	const initialSpeed = search.speed === "Express" ? "Express" : "Standard";
	const ref = refFromUrl;
	const [fullName, setFullName] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [sameWhats, setSameWhats] = (0, import_react.useState)(true);
	const [whatsapp, setWhatsapp] = (0, import_react.useState)("");
	const [hostel, setHostel] = (0, import_react.useState)("");
	const [room, setRoom] = (0, import_react.useState)("");
	const [services, setServices] = (0, import_react.useState)(["Wash & Iron"]);
	const [offer, setOffer] = (0, import_react.useState)("Standard Student Wash");
	const [referral, setReferral] = (0, import_react.useState)("Yes");
	const [referredByInput, setReferredByInput] = (0, import_react.useState)(refFromUrl);
	const [consent, setConsent] = (0, import_react.useState)(true);
	const [errors, setErrors] = (0, import_react.useState)({});
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [serviceSpeed, setServiceSpeed] = (0, import_react.useState)(initialSpeed);
	const [leavingCampus, setLeavingCampus] = (0, import_react.useState)("");
	const todayStr = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
	const [pickupDate, setPickupDate] = (0, import_react.useState)("");
	const [pickupTimeSlot, setPickupTimeSlot] = (0, import_react.useState)("");
	const [pinCode, setPinCode] = (0, import_react.useState)("");
	const [activeStudent, setActiveStudent] = (0, import_react.useState)(null);
	const [orderItems, setOrderItems] = (0, import_react.useState)([]);
	const [itemServices, setItemServices] = (0, import_react.useState)({});
	const [customItemName, setCustomItemName] = (0, import_react.useState)("");
	const [customItemQty, setCustomItemQty] = (0, import_react.useState)(1);
	const [customItemService, setCustomItemService] = (0, import_react.useState)("Wash & Iron");
	const estimatedTotal = (0, import_react.useMemo)(() => {
		return orderItems.reduce((acc, item) => acc + (item.totalPrice || 0), 0);
	}, [orderItems]);
	const hasPendingCustomItems = (0, import_react.useMemo)(() => {
		return orderItems.some((item) => item.isCustom);
	}, [orderItems]);
	const updateItemQty = (itemName, serviceType, qty, isExpressOverride) => {
		const isExp = isExpressOverride !== void 0 ? isExpressOverride : serviceSpeed === "Express";
		setOrderItems((prev) => {
			const idx = prev.findIndex((x) => x.itemName === itemName && !x.isCustom);
			if (qty <= 0) {
				if (idx < 0) return prev;
				return prev.filter((_, i) => i !== idx);
			}
			const unitPrice = getItemUnitPrice(itemName, serviceType, isExp);
			const updated = {
				itemName,
				quantity: qty,
				serviceType,
				unitPrice,
				totalPrice: unitPrice * qty,
				isCustom: false,
				pricingStatus: "Calculated"
			};
			if (idx >= 0) {
				const next = [...prev];
				next[idx] = updated;
				return next;
			} else return [...prev, updated];
		});
	};
	const handleSpeedChange = (newSpeed) => {
		setServiceSpeed(newSpeed);
		const isExp = newSpeed === "Express";
		setOrderItems((prev) => prev.map((item) => {
			if (item.isCustom) return item;
			const unitPrice = getItemUnitPrice(item.itemName, item.serviceType, isExp);
			return {
				...item,
				unitPrice,
				totalPrice: unitPrice * item.quantity
			};
		}));
	};
	const addCustomItem = () => {
		if (!customItemName.trim()) return;
		const newItem = {
			itemName: customItemName.trim(),
			quantity: Math.max(1, customItemQty),
			serviceType: customItemService,
			unitPrice: 0,
			totalPrice: 0,
			isCustom: true,
			pricingStatus: "Pending Admin Pricing"
		};
		setOrderItems((prev) => [...prev, newItem]);
		setCustomItemName("");
		setCustomItemQty(1);
	};
	const removeOrderItem = (index) => {
		setOrderItems((prev) => prev.filter((_, i) => i !== index));
	};
	const [isOnline, setIsOnline] = (0, import_react.useState)(typeof navigator !== "undefined" ? navigator.onLine : true);
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		const activeId = localStorage.getItem("urbanwash_active_student");
		if (activeId) {
			const found = loadStudents().find((s) => s.customerId === activeId);
			if (found) {
				setActiveStudent(found);
				setFullName(found.fullName);
				setPhone(found.phone);
				setWhatsapp(found.whatsapp);
				setHostel(found.hostel);
				setRoom(found.room);
				if (found.pinCode) setPinCode(found.pinCode);
			}
		}
		const handleOnline = () => {
			setIsOnline(true);
			syncWithCloud().catch((err) => {
				console.error("Online transition sync failed:", err);
			});
		};
		const handleOffline = () => {
			setIsOnline(false);
		};
		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", handleOffline);
		return () => {
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleOffline);
		};
	}, []);
	const isNumericRoom = hostel === "Hostel 1" || hostel === "Hostel 2";
	const cleanPhone = (val) => {
		return val.replace(/\s+/g, "");
	};
	const schema = (0, import_react.useMemo)(() => {
		if (activeStudent) return objectType({
			services: arrayType(stringType()).min(1, "Please select at least one laundry service of interest"),
			serviceSpeed: enumType(["Standard", "Express"]),
			consent: literalType(true, { errorMap: () => ({ message: "You must agree to terms to schedule" }) })
		});
		return objectType({
			fullName: stringType().trim().min(2, "Please enter your full name (minimum 2 characters)").max(100, "Name is too long"),
			phone: stringType().transform(cleanPhone).refine((val) => phoneRe.test(val), { message: "Enter a valid TZ number (e.g. 07XXXXXXXX, 06XXXXXXXX, or +2557XXXXXXXX)" }),
			whatsapp: sameWhats ? stringType() : stringType().transform(cleanPhone).refine((val) => phoneRe.test(val), { message: "Enter a valid TZ WhatsApp number" }),
			hostel: stringType().min(1, "Please select your hostel"),
			room: isNumericRoom ? stringType().regex(/^\d+$/, "Room number must be numeric digits only") : stringType().regex(/^[A-Za-z0-9]+$/, "Room code must be alphanumeric (letters and numbers)"),
			services: arrayType(stringType()).min(1, "Please select at least one laundry service of interest"),
			serviceSpeed: enumType(["Standard", "Express"]),
			pinCode: stringType().regex(/^\d{4}$/, "Create a 4-digit PIN for secure login (e.g. 1234)"),
			consent: literalType(true, { errorMap: () => ({ message: "You must agree to receive marketing notifications to register" }) })
		});
	}, [
		activeStudent,
		isNumericRoom,
		sameWhats
	]);
	function toggleService(s) {
		setServices((cur) => cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]);
	}
	function onSubmit(e) {
		e.preventDefault();
		setSubmitting(true);
		const rawPhone = cleanPhone(phone);
		const rawWhatsapp = sameWhats ? rawPhone : cleanPhone(whatsapp);
		const validationData = activeStudent ? {
			services,
			serviceSpeed,
			consent,
			pickupDate,
			pickupTimeSlot
		} : {
			fullName,
			phone: rawPhone,
			whatsapp: rawWhatsapp,
			hostel,
			room: room.trim().toUpperCase(),
			services,
			serviceSpeed,
			consent,
			pickupDate,
			pickupTimeSlot,
			pinCode
		};
		const result = schema.safeParse(validationData);
		if (!result.success) {
			const errs = {};
			for (const issue of result.error.issues) errs[issue.path[0]] = issue.message;
			setErrors(errs);
			setSubmitting(false);
			const firstErrorKey = Object.keys(errs)[0];
			const element = document.getElementById(`field-${firstErrorKey}`);
			if (element) element.scrollIntoView({
				behavior: "smooth",
				block: "center"
			});
			return;
		}
		setErrors({});
		const studentId = activeStudent ? activeStudent.customerId : generateCustomerId();
		const finalName = activeStudent ? activeStudent.fullName : fullName.trim();
		const finalPhone = activeStudent ? activeStudent.phone : rawPhone;
		const finalWhatsapp = activeStudent ? activeStudent.whatsapp : rawWhatsapp;
		const finalHostel = activeStudent ? activeStudent.hostel : hostel;
		const finalRoom = activeStudent ? activeStudent.room : room.trim().toUpperCase();
		const finalPin = activeStudent ? activeStudent.pinCode : pinCode;
		const student = {
			customerId: studentId,
			orderId: generateOrderId(),
			fullName: finalName,
			phone: finalPhone,
			whatsapp: finalWhatsapp,
			hostel: finalHostel,
			room: finalRoom,
			services: services.length > 0 ? services : ["Washing", "Ironing"],
			offer: activeStudent ? activeStudent.offer : offer,
			referralStatus: referral,
			referredBy: ref,
			consent,
			status: "Lead Registered",
			createdAt: (/* @__PURE__ */ new Date()).toISOString(),
			serviceSpeed,
			leavingCampus: leavingCampus || void 0,
			pickupDate: pickupDate || void 0,
			pickupTimeSlot: pickupTimeSlot || void 0,
			pinCode: finalPin || void 0,
			orderItems: orderItems.length > 0 ? orderItems : void 0,
			estimatedTotal: estimatedTotal > 0 ? estimatedTotal : void 0
		};
		try {
			saveStudent(student);
			if (typeof window !== "undefined") localStorage.setItem("urbanwash_active_student", studentId);
			navigate({ to: "/dashboard" });
		} catch (err) {
			console.error(err);
			setErrors({ submit: "Failed to save registration. Please try again." });
			setSubmitting(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold py-2.5 px-4 text-center shadow-sm",
				children: "🚚 FREE PICKUP & DELIVERY ALWAYS ON EVERY ORDER"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-2xl px-4 mt-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center md:text-left mb-6 space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-xl sm:text-2xl font-black tracking-tight text-slate-900",
									children: "Student Account Registration & Pickup"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-slate-500 mt-1",
									children: "Enter your student profile information to create your account and schedule your laundry pickup."
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: `inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shrink-0 border ${isOnline ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200 animate-pulse"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-2 w-2 rounded-full ${isOnline ? "bg-emerald-500" : "bg-amber-500"}` }), isOnline ? "Connected" : "Offline"]
								})]
							}),
							activeStudent ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-2xl text-xs font-semibold flex items-center justify-between gap-3 shadow-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-5 w-5 text-emerald-600 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-extrabold text-sm text-emerald-950",
										children: ["Logged in as ", activeStudent.fullName]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-emerald-800 text-[11px]",
										children: [
											"Customer ID: ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono font-bold",
												children: activeStudent.customerId
											}),
											" • Phone: ",
											activeStudent.phone
										]
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/dashboard",
									className: "text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl transition shrink-0",
									children: "My Dashboard →"
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 bg-amber-50 border-2 border-amber-300 text-amber-950 rounded-2xl text-xs font-semibold flex items-center justify-between gap-3 shadow-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-5 w-5 text-amber-600 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-extrabold text-sm text-amber-950",
										children: "Already registered with UrbanWash?"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-amber-800 text-[11px]",
										children: "Please log in first to quickly schedule your pickup with your saved details."
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/login",
									search: {
										redirect: "/register",
										intent: "schedule"
									},
									className: "text-xs bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1.5 rounded-xl transition shrink-0 shadow-sm",
									children: "Log In First →"
								})]
							}),
							!isOnline && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl text-[11px] leading-relaxed",
								children: [
									"⚠️ ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Offline Mode:" }),
									" Registrations will cache locally and sync automatically when internet access is restored."
								]
							}),
							ref && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquareCheckBig, { className: "h-4 w-4 text-emerald-600 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"🎁 Referred by student ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: ref }),
									". Complete registration to claim free delivery & rewards!"
								] })]
							})
						]
					}),
					errors.submit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 text-rose-600 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: errors.submit })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit,
						className: "space-y-6 bg-white rounded-3xl p-5 sm:p-8 shadow-sm border border-slate-100",
						children: [
							!activeStudent && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-6 pb-6 border-b border-slate-100",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
										className: "text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4 text-blue-600" }), "1. Account & Contact Information"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										id: "field-fullName",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, {
												icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4 text-blue-500" }),
												label: "Full Name",
												required: true
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												value: fullName,
												onChange: (e) => setFullName(e.target.value),
												className: `${inputCls} ${errors.fullName ? "border-rose-400 focus:ring-rose-200" : ""}`,
												placeholder: "e.g. Juma Kassim",
												disabled: submitting,
												autoComplete: "name"
											}),
											errors.fullName && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-rose-500 text-xs mt-1 font-medium",
												children: errors.fullName
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										id: "field-phone",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, {
												icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-4 w-4 text-blue-500" }),
												label: "Phone Number",
												required: true
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												id: "phone",
												value: phone,
												onChange: (e) => setPhone(e.target.value),
												className: `${inputCls} ${errors.phone ? "border-rose-400 focus:ring-rose-200" : ""}`,
												placeholder: "e.g. 0712345678 or 06XXXXXXXX",
												disabled: submitting,
												inputMode: "tel",
												autoComplete: "tel"
											}),
											errors.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-rose-500 text-xs mt-1 font-medium",
												children: errors.phone
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "bg-slate-50 p-4 rounded-2xl border border-slate-100/50",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "flex items-center gap-2.5 cursor-pointer select-none",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												checked: sameWhats,
												onChange: (e) => {
													setSameWhats(e.target.checked);
													if (e.target.checked) setWhatsapp("");
												},
												className: "w-4.5 h-4.5 accent-blue-600 rounded cursor-pointer",
												disabled: submitting
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-semibold text-slate-700",
												children: "WhatsApp number same as Phone Number"
											})]
										}), !sameWhats && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											id: "field-whatsapp",
											className: "mt-4 pt-3 border-t border-slate-200/50",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, {
													icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "h-4 w-4 text-emerald-500" }),
													label: "WhatsApp Number",
													required: true
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "tel",
													value: whatsapp,
													onChange: (e) => setWhatsapp(e.target.value),
													className: `${inputCls} ${errors.whatsapp ? "border-rose-400 focus:ring-rose-200" : ""}`,
													placeholder: "e.g. 0712345678",
													disabled: submitting
												}),
												errors.whatsapp && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-rose-500 text-xs mt-1 font-medium",
													children: errors.whatsapp
												})
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										id: "field-pinCode",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, {
												icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-4 w-4 text-indigo-500" }),
												label: "Create Account 4-Digit Security PIN",
												required: true
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-slate-400 mb-2",
												children: "Set a 4-digit PIN so you can securely log in to track your order anytime."
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "password",
												maxLength: 4,
												inputMode: "numeric",
												value: pinCode,
												onChange: (e) => setPinCode(e.target.value.replace(/\D/g, "").slice(0, 4)),
												className: `${inputCls} font-mono tracking-widest text-center text-lg ${errors.pinCode ? "border-rose-400 focus:ring-rose-200" : ""}`,
												placeholder: "••••",
												disabled: submitting
											}),
											errors.pinCode && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-rose-500 text-xs mt-1 font-medium",
												children: errors.pinCode
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										id: "field-hostel",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, {
												icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "h-4 w-4 text-blue-500" }),
												label: "Hostel",
												required: true
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												value: hostel,
												onChange: (e) => {
													setHostel(e.target.value);
													setRoom("");
												},
												className: `${inputCls} ${errors.hostel ? "border-rose-400 focus:ring-rose-200" : ""}`,
												disabled: submitting,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "",
													children: "-- Choose Hostel --"
												}), HOSTELS.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: h,
													children: h
												}, h))]
											}),
											errors.hostel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-rose-500 text-xs mt-1 font-medium",
												children: errors.hostel
											})
										]
									}),
									hostel && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										id: "field-room",
										className: "animate-fade-in",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, {
												icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "h-4 w-4 text-blue-500" }),
												label: isNumericRoom ? "Room Number" : "Room Code",
												required: true
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												value: room,
												onChange: (e) => {
													const val = e.target.value;
													if (isNumericRoom) setRoom(val.replace(/\D/g, ""));
													else setRoom(val.replace(/[^A-Za-z0-9]/g, ""));
												},
												className: `${inputCls} ${errors.room ? "border-rose-400 focus:ring-rose-200" : ""}`,
												placeholder: isNumericRoom ? "e.g. 205" : "e.g. H06B",
												disabled: submitting,
												inputMode: isNumericRoom ? "numeric" : "text"
											}),
											errors.room && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-rose-500 text-xs mt-1 font-medium",
												children: errors.room
											})
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								id: "field-pickupDate",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, {
										icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-4 w-4 text-blue-500" }),
										label: "Preferred Pickup Date",
										required: true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-slate-400 mb-3",
										children: "Choose the date you'd like us to collect your laundry."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "relative",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "date",
											value: pickupDate,
											min: todayStr,
											onChange: (e) => setPickupDate(e.target.value),
											disabled: submitting,
											className: `w-full px-4 py-3.5 rounded-2xl border bg-white text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition text-sm shadow-inner cursor-pointer ${errors.pickupDate ? "border-rose-400 focus:ring-rose-200" : "border-slate-200"}`
										})
									}),
									pickupDate && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2.5 flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarCheck, { className: "h-4 w-4 shrink-0" }),
											"Pickup scheduled for:",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-black",
												children: (/* @__PURE__ */ new Date(pickupDate + "T00:00:00")).toLocaleDateString("en-GB", {
													weekday: "long",
													year: "numeric",
													month: "long",
													day: "numeric"
												})
											})
										]
									}),
									errors.pickupDate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-rose-500 text-xs mt-1 font-medium",
										children: errors.pickupDate
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								id: "field-pickupTimeSlot",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, {
										icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4 text-blue-500" }),
										label: "Preferred Pickup Time Slot"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-slate-400 mb-3",
										children: "Select the time window that works best for your schedule."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid grid-cols-1 sm:grid-cols-3 gap-2.5",
										children: [
											{
												slot: "Morning (8AM - 11AM)",
												emoji: "🌅",
												time: "8:00 AM - 11:00 AM"
											},
											{
												slot: "Afternoon (1PM - 4PM)",
												emoji: "☀️",
												time: "1:00 PM - 4:00 PM"
											},
											{
												slot: "Evening (7PM - 10PM)",
												emoji: "🌙",
												time: "7:00 PM - 10:00 PM"
											}
										].map(({ slot, emoji, time }) => {
											const active = pickupTimeSlot === slot;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => setPickupTimeSlot(active ? "" : slot),
												disabled: submitting,
												className: `px-3.5 py-3 rounded-2xl border text-xs font-bold transition cursor-pointer flex flex-col items-center gap-1 ${active ? "bg-blue-600 text-white border-blue-600 shadow-sm" : "bg-white border-slate-200 text-slate-700 hover:border-blue-300"}`,
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-lg",
														children: emoji
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-extrabold",
														children: slot.split(" ")[0]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: `text-[10px] ${active ? "text-blue-100" : "text-slate-400"}`,
														children: time
													})
												]
											}, slot);
										})
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								id: "field-services",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, {
											icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquareCheckBig, { className: "h-4 w-4 text-blue-500" }),
											label: "Service Interest",
											required: true
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/pricing",
											className: "inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-100/85 text-xs font-bold transition duration-200 mb-2 cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]",
											children: "View Detailed Prices 💰"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-slate-400 mb-2",
										children: "Select all services you might be interested in:"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid grid-cols-1 sm:grid-cols-3 gap-2",
										children: SERVICES.map((s) => {
											const active = services.includes(s);
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => toggleService(s),
												disabled: submitting,
												className: `px-4 py-3 rounded-xl border text-sm font-semibold transition flex items-center justify-between cursor-pointer ${active ? "bg-blue-600 text-white border-blue-600 shadow-sm" : "bg-white border-slate-200 text-slate-700 hover:border-blue-300"}`,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s }), active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-white" })]
											}, s);
										})
									}),
									errors.services && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-rose-500 text-xs mt-1.5 font-medium",
										children: errors.services
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-white rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm border border-slate-200/90",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-2 border-b border-slate-100 pb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-black text-blue-700 uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100",
												children: "⚡ Live Auto-Pricing Calculator"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "text-lg font-black text-slate-900 mt-1",
												children: "Select Clothes & Quantities"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-slate-500",
												children: "Enter item counts — prices calculate automatically in real time!"
											})
										] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-6 w-6 text-amber-500 shrink-0" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "space-y-3 pt-1",
										children: [
											{
												name: "Shirt / T-Shirt",
												emoji: "👕"
											},
											{
												name: "Suruali (Trousers/Jeans)",
												emoji: "👖"
											},
											{
												name: "Shuka (Bed Sheet)",
												emoji: "🛌"
											},
											{
												name: "Kanzu",
												emoji: "👘"
											},
											{
												name: "Taulo (Towel)",
												emoji: "🧴"
											},
											{
												name: "Sweta / Hoodie",
												emoji: "🧥"
											},
											{
												name: "Lab Coat",
												emoji: "🥼"
											},
											{
												name: "Blanket / Duvet",
												emoji: "🛌"
											}
										].map((item) => {
											const itemEntry = orderItems.find((x) => x.itemName === item.name && !x.isCustom);
											const qty = itemEntry?.quantity || 0;
											const currentService = itemServices[item.name] || itemEntry?.serviceType || "Wash & Iron";
											const unitPrice = getItemUnitPrice(item.name, currentService, serviceSpeed === "Express");
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-3",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-xl bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs",
														children: item.emoji
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "font-extrabold text-xs text-slate-900",
														children: item.name
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "text-[11px] text-slate-500",
														children: [
															"Unit Price: ",
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "text-blue-700 font-mono font-bold",
																children: [
																	"TShs ",
																	unitPrice.toLocaleString(),
																	"/="
																]
															}),
															serviceSpeed === "Express" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "ml-1.5 text-[9px] bg-amber-500 text-white font-bold px-1.5 py-0.2 rounded-full uppercase",
																children: "Express"
															})
														]
													})] })]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2.5 justify-between sm:justify-end",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
														value: currentService,
														onChange: (e) => {
															const newSvc = e.target.value;
															setItemServices((prev) => ({
																...prev,
																[item.name]: newSvc
															}));
															if (qty > 0) updateItemQty(item.name, newSvc, qty);
														},
														className: "bg-white border border-slate-200 text-slate-800 text-xs font-bold px-3 py-2 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-2xs",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																value: "Wash & Iron",
																children: "Wash & Iron"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																value: "Wash & Fold",
																children: "Wash & Fold"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																value: "Iron Only",
																children: "Iron Only"
															})
														]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-1 shadow-2xs",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																type: "button",
																onClick: () => updateItemQty(item.name, currentService, Math.max(0, qty - 1)),
																className: "w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-base flex items-center justify-center transition cursor-pointer active:scale-95",
																children: "-"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "w-7 text-center font-mono font-black text-sm text-blue-700",
																children: qty
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																type: "button",
																onClick: () => updateItemQty(item.name, currentService, qty + 1),
																className: "w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-base flex items-center justify-center transition cursor-pointer active:scale-95",
																children: "+"
															})
														]
													})]
												})]
											}, item.name);
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pt-3 border-t border-slate-100 space-y-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs font-bold text-amber-700 flex items-center gap-1.5",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Item Not on the List?" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[11px] text-slate-500 leading-snug",
												children: "Type custom items below (e.g. Suit Jacket, Curtains, Shoes). Our admin will inspect & set the exact price at pickup!"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "grid grid-cols-1 sm:grid-cols-12 gap-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "text",
														value: customItemName,
														onChange: (e) => setCustomItemName(e.target.value),
														placeholder: "Custom Item Name (e.g. Suit, Carpet)",
														className: "sm:col-span-5 bg-white border border-slate-200 text-slate-800 text-xs px-3 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "number",
														min: 1,
														value: customItemQty,
														onChange: (e) => setCustomItemQty(parseInt(e.target.value) || 1),
														placeholder: "Qty",
														className: "sm:col-span-2 bg-white border border-slate-200 text-slate-800 text-xs px-3 py-2.5 rounded-xl text-center outline-none focus:ring-2 focus:ring-blue-500 font-mono font-bold"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
														value: customItemService,
														onChange: (e) => setCustomItemService(e.target.value),
														className: "sm:col-span-3 bg-white border border-slate-200 text-slate-800 text-xs px-2 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																value: "Wash & Iron",
																children: "Wash & Iron"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																value: "Wash & Fold",
																children: "Wash & Fold"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																value: "Iron Only",
																children: "Iron Only"
															})
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														onClick: addCustomItem,
														className: "sm:col-span-2 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs px-3 py-2.5 rounded-xl transition shadow-sm cursor-pointer active:scale-95",
														children: "+ Add"
													})
												]
											})
										]
									}),
									orderItems.filter((x) => x.isCustom).length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5 pt-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] font-bold text-slate-700",
											children: "Added Custom Items:"
										}), orderItems.map((item, idx) => {
											if (!item.isCustom) return null;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-between text-xs",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-bold text-amber-900",
														children: item.itemName
													}),
													" ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-slate-600",
														children: [
															"(",
															item.quantity,
															"x • ",
															item.serviceType,
															")"
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-[10px] text-amber-700 font-semibold",
														children: "⏳ Price to be set by Admin upon pickup"
													})
												] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => removeOrderItem(idx),
													className: "text-rose-600 hover:text-rose-700 text-xs font-bold px-2 py-1 cursor-pointer",
													children: "✕ Remove"
												})]
											}, idx);
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "bg-gradient-to-r from-blue-900 to-indigo-900 border border-blue-800 text-white rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-blue-200 font-bold",
												children: "Estimated Order Total:"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-2xl sm:text-3xl font-black text-amber-300 tracking-tight font-mono",
												children: [
													"TShs ",
													estimatedTotal.toLocaleString(),
													"/="
												]
											}),
											hasPendingCustomItems && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[10px] text-amber-200 font-medium mt-0.5",
												children: "* Includes custom item(s) pending admin pricing confirmation."
											})
										] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-right text-[11px] text-blue-200 bg-white/10 px-4 py-2.5 rounded-xl border border-white/10",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "font-extrabold text-white",
												children: ["📦 Total Clothes: ", orderItems.reduce((a, b) => a + b.quantity, 0)]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[10px] text-emerald-300 font-semibold mt-0.5",
												children: "Free Pick Up & Delivery Included"
											})]
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								id: "field-serviceSpeed",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, {
										icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4 text-amber-500" }),
										label: "Choose Service Speed & Turnaround",
										required: true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-slate-400 mb-3",
										children: "Select Standard for regular student pricing, or Express for same-day priority processing:"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => handleSpeedChange("Standard"),
											disabled: submitting,
											className: `p-4 rounded-2xl border text-left transition cursor-pointer flex items-start gap-3 ${serviceSpeed === "Standard" ? "bg-blue-50/80 border-blue-500 text-slate-900 ring-2 ring-blue-500/20 shadow-sm" : "bg-white border-slate-200 text-slate-600 hover:border-blue-300"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: `p-2.5 rounded-xl text-lg shrink-0 ${serviceSpeed === "Standard" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"}`,
												children: "🐢"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "font-extrabold text-sm text-slate-900",
													children: "Standard Service"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[11px] text-slate-500 font-medium mt-0.5",
													children: "48 - 72 Hours Turnaround"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "inline-block mt-2 text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full",
													children: "Regular Student Prices"
												})
											] })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => handleSpeedChange("Express"),
											disabled: submitting,
											className: `p-4 rounded-2xl border text-left transition cursor-pointer flex items-start gap-3 ${serviceSpeed === "Express" ? "bg-amber-50/90 border-amber-500 text-slate-900 ring-2 ring-amber-500/20 shadow-sm" : "bg-white border-slate-200 text-slate-600 hover:border-amber-300"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: `p-2.5 rounded-xl text-lg shrink-0 ${serviceSpeed === "Express" ? "bg-amber-500 text-white" : "bg-slate-100 text-slate-500"}`,
												children: "⚡"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "font-extrabold text-sm text-amber-950 flex items-center gap-1",
													children: ["Express Fast-Track ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[10px] bg-amber-500 text-white font-bold px-1.5 py-0.2 rounded-full",
														children: "Priority"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[11px] text-amber-900 font-medium mt-0.5",
													children: "Same-Day / Up to 4h Turnaround"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "inline-block mt-2 text-[10px] font-bold bg-amber-200 text-amber-950 px-2 py-0.5 rounded-full",
													children: "500s ➔ 3,000/= • 1000s ➔ 5,000/= • Blanket ➔ 10,000/="
												})
											] })]
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, {
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gift, { className: "h-4 w-4 text-blue-500" }),
									label: "Join Our Referral Program?",
									required: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-slate-400 mb-2.5",
									children: "Would you like to earn rewards by inviting friends?"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-2 gap-3",
									children: ["Yes", "No"].map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setReferral(opt),
										disabled: submitting,
										className: `py-2.5 rounded-xl border text-sm font-bold transition cursor-pointer ${referral === opt ? "bg-blue-600 text-white border-blue-600" : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"}`,
										children: opt === "Yes" ? "Yes, Join & Earn" : "No, Skip"
									}, opt))
								}),
								referral === "Yes" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 p-4 bg-blue-50 border border-blue-100 text-blue-950 rounded-2xl text-xs leading-relaxed animate-fade-in",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-blue-700 block mb-1",
											children: "🎁 Referral Program Reward:"
										}),
										"Refer 3 students to sign up, and receive a",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "FREE wash worth TZS 2,500" }),
										" (valid for up to 5 clothes)!"
									]
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								id: "field-consent",
								className: "pt-2 border-t border-slate-100",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-start gap-3 cursor-pointer select-none",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: consent,
										onChange: (e) => setConsent(e.target.checked),
										className: "w-5.5 h-5.5 mt-0.5 accent-blue-600 rounded cursor-pointer",
										disabled: submitting
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs font-medium text-slate-600 leading-relaxed",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-slate-800 font-semibold",
												children: "☑ I agree to receive"
											}),
											" laundry reminders, service updates, and special promotional offers from",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "URBAN WASH" }),
											" via WhatsApp or SMS."
										]
									})]
								}), errors.consent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-rose-500 text-xs mt-1.5 font-medium",
									children: errors.consent
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									disabled: submitting,
									className: "w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-4 rounded-2xl font-bold text-lg shadow-md hover:scale-[1.01] active:scale-[0.99] transition duration-200 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer",
									children: submitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-5 w-5 animate-spin" }), "Saving & Syncing to Cloud..."] }) : activeStudent ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarCheck, { className: "h-5 w-5" }), "Schedule Pickup"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarCheck, { className: "h-5 w-5" }), "Complete Registration & Schedule Pickup →"] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-slate-400 text-center mt-3",
									children: "By submitting this form, your pickup will be booked. Always 100% secure."
								})]
							})
						]
					})
				]
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})]
	});
}
var inputCls = "w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition text-sm sm:text-base shadow-inner";
function FieldLabel({ icon, label, required }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 mb-2",
		children: [icon, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [label, required && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-rose-500 ml-0.5",
			children: "*"
		})] })]
	});
}
//#endregion
export { Register as component };
