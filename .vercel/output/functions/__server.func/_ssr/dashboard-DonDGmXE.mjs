import { r as __toESM } from "../_runtime.mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as getReferralCount, f as saveStudent, l as getReferralRewardStatus, p as syncWithCloud, u as loadStudents } from "./storage-Dnf1ak9H.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { B as CircleAlert, E as LogOut, F as Copy, I as Clock, R as CircleCheck, U as CalendarCheck, d as ShoppingBag, f as Shirt, h as Share2, t as Zap, w as MapPin, x as Phone } from "../_libs/lucide-react.mjs";
import { n as Navbar, t as Footer } from "./Navbar-Cy8W0WK2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-DonDGmXE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var WHATSAPP_CONTACT = "255687771750";
function StudentDashboardPage() {
	const navigate = useNavigate();
	const [student, setStudent] = (0, import_react.useState)(null);
	const [allStudents, setAllStudents] = (0, import_react.useState)([]);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const [syncing, setSyncing] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let activeId = "";
		if (typeof window !== "undefined") activeId = localStorage.getItem("urbanwash_active_student") || "";
		const localList = loadStudents();
		setAllStudents(localList);
		if (activeId) {
			const found = localList.find((s) => s.customerId === activeId);
			if (found) setStudent(found);
			else if (localList.length > 0) setStudent(localList[localList.length - 1]);
		} else if (localList.length > 0) setStudent(localList[localList.length - 1]);
		setSyncing(true);
		syncWithCloud((merged) => {
			setAllStudents(merged);
			if (activeId) {
				const foundRemote = merged.find((s) => s.customerId === activeId);
				if (foundRemote) setStudent(foundRemote);
			}
			setSyncing(false);
		}).catch(() => setSyncing(false));
	}, []);
	function handleLogout() {
		if (typeof window !== "undefined") localStorage.removeItem("urbanwash_active_student");
		navigate({ to: "/login" });
	}
	const refLink = typeof window !== "undefined" ? `${window.location.origin}/register?ref=${student?.customerId ?? ""}` : `https://urbanwash.app/register?ref=${student?.customerId ?? ""}`;
	const shareText = `Hujambo! Jiunge na URBAN WASH 🧺 — washing, ironing & wash-iron services kwa wanafunzi wa ATC. FREE pickup & delivery! Jisajili hapa: ${refLink}`;
	const waShareLink = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
	const waTrackUs = `https://wa.me/${WHATSAPP_CONTACT}?text=${encodeURIComponent(`Habari URBAN WASH! Nataka kufuatilia order yangu. Jina langu ni ${student?.fullName ?? ""}, Customer ID: ${student?.customerId ?? ""}, Chumba: ${student?.hostel ?? ""} ${student?.room ?? ""}.`)}`;
	function copyRefLink() {
		navigator.clipboard.writeText(refLink);
		setCopied(true);
		setTimeout(() => setCopied(false), 2e3);
	}
	const [paymentFeedback, setPaymentFeedback] = (0, import_react.useState)(null);
	const [ratingFeedback, setRatingFeedback] = (0, import_react.useState)(null);
	const getStepIndex = (status) => {
		switch (status) {
			case "Lead Registered": return 1;
			case "Contacted": return 2;
			case "First Order Completed":
			case "Repeat Customer":
			case "VIP Customer": return 4;
			default: return 2;
		}
	};
	const stepIndex = getStepIndex(student?.status);
	const refCount = student ? getReferralCount(student.customerId, allStudents) : 0;
	const refReward = student ? getReferralRewardStatus(student.customerId, allStudents) : "Pending";
	if (!student) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-slate-50 flex items-center justify-center p-4 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white rounded-3xl p-8 max-w-sm border border-slate-100 shadow-xl space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-12 w-12 text-slate-300 mx-auto" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl font-black text-slate-900",
					children: "No Account Logged In"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-slate-500",
					children: "Please log in with your phone number or schedule your first pickup to view your dashboard."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2 pt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						className: "bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-xl transition",
						children: "Log In to My Order"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/register",
						className: "border border-slate-200 text-slate-700 font-bold text-xs py-3 rounded-xl transition hover:bg-slate-50",
						children: "Schedule Pickup"
					})]
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, { syncing }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "flex-1 mx-auto max-w-4xl px-4 mt-6 space-y-6 w-full",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-blue-800/50",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase tracking-wider border border-blue-500/30",
									children: "🎓 ATC Student Account"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
									className: "text-2xl sm:text-3xl font-black mt-2 tracking-tight",
									children: [
										"Hi, ",
										student.fullName.split(" ")[0],
										" 👋"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs sm:text-sm text-blue-200 mt-1 flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3.5 w-3.5 text-teal-300" }),
										student.hostel,
										" • Room ",
										student.room
									]
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-end gap-2.5 shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/10 text-center sm:text-right w-full",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-blue-200 block font-semibold uppercase tracking-wider",
										children: "Customer ID"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-base font-black text-white tracking-wider",
										children: student.customerId
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: handleLogout,
									className: "w-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 hover:text-white border border-rose-500/40 text-xs font-extrabold px-3.5 py-1.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Log Out" })]
								})]
							})]
						})
					}),
					student.leavingCampus === "Today" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-3xl text-xs font-semibold leading-relaxed flex items-start gap-3 shadow-sm animate-pulse",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xl",
							children: "🚨"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-extrabold text-rose-900 text-sm",
							children: "Priority Dispatch Flagged!"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-rose-700 mt-0.5",
							children: "You indicated leaving campus today. Our dispatcher will prioritize your pickup & delivery."
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 flex-wrap",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
										className: "text-lg font-black text-slate-900 tracking-tight flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-5 w-5 text-blue-600" }), "Live Order Tracking"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono text-xs font-black bg-slate-900 text-amber-300 px-3 py-1 rounded-xl shadow-xs",
										children: ["Order ID: ", student.orderId || `ORD-2026-${student.customerId.slice(-4)}`]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-slate-500 mt-0.5",
									children: "Track your laundry pickup & delivery status in real time"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs font-bold bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-100 self-start sm:self-auto",
									children: ["Status: ", student.status]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative py-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-1/2 left-0 right-0 h-1.5 bg-slate-100 -translate-y-1/2 rounded-full z-0" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute top-1/2 left-0 h-1.5 bg-gradient-to-r from-blue-600 to-emerald-500 -translate-y-1/2 rounded-full z-0 transition-all duration-700",
										style: { width: `${(stepIndex - 1) / 3 * 100}%` }
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "relative z-10 flex justify-between",
										children: [
											{
												title: "Booked",
												desc: "Order Received",
												step: 1,
												icon: "📥"
											},
											{
												title: "Pickup",
												desc: "En Route",
												step: 2,
												icon: "🚚"
											},
											{
												title: "Processing",
												desc: "Wash & Iron",
												step: 3,
												icon: "🧼"
											},
											{
												title: "Delivered",
												desc: "Back to Room",
												step: 4,
												icon: "✅"
											}
										].map((s) => {
											const isCompleted = stepIndex >= s.step;
											const isCurrent = stepIndex === s.step;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-col items-center text-center max-w-[80px] sm:max-w-[100px]",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: `h-10 w-10 sm:h-12 sm:w-12 rounded-2xl flex items-center justify-center font-bold text-sm transition-all duration-300 ${isCompleted ? "bg-emerald-500 text-white shadow-md ring-4 ring-emerald-100" : isCurrent ? "bg-blue-600 text-white ring-4 ring-blue-100 animate-bounce" : "bg-white text-slate-400 border-2 border-slate-200"}`,
														children: s.icon
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: `text-xs font-bold mt-2 ${isCompleted ? "text-slate-900" : "text-slate-400"}`,
														children: s.title
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[10px] text-slate-400 font-medium hidden sm:block",
														children: s.desc
													})
												]
											}, s.step);
										})
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-slate-600",
									children: "Need to change pickup date or ask a question?"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: waTrackUs,
									target: "_blank",
									rel: "noreferrer",
									className: "w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs py-3 px-5 rounded-2xl shadow-sm transition",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-4 w-4" }), "Chat with WhatsApp Dispatcher"]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200",
									children: "📋 Scheduled Order Breakdown"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "text-lg font-black text-slate-900 mt-1 flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shirt, { className: "h-5 w-5 text-indigo-600" }), "Itemized Clothes & Pricing"]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `text-xs font-extrabold px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 border self-start sm:self-auto ${student.adminVerified ? "bg-emerald-50 text-emerald-800 border-emerald-300 shadow-sm" : "bg-amber-50 text-amber-800 border-amber-300 animate-pulse"}`,
									children: student.adminVerified ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-emerald-600" }), "Verified at Pickup by Admin"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4 text-amber-600" }), "Pending Admin Pickup Check"] })
								})]
							}),
							student.adminVerified && student.adminVerificationNotes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-semibold flex items-start gap-2.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-extrabold",
									children: "Admin Verification Note:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-emerald-800 text-[11px] mt-0.5",
									children: student.adminVerificationNotes
								})] })
							}),
							student.orderItems && student.orderItems.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "overflow-x-auto rounded-2xl border border-slate-200",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
									className: "w-full text-xs text-left",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
										className: "bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase text-[10px]",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-3",
												children: "Item Description"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-3 text-center",
												children: "Service"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-3 text-center",
												children: "Quantity"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-3 text-right",
												children: "Unit Price"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-3 text-right",
												children: "Line Total"
											})
										] })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
										className: "divide-y divide-slate-100",
										children: student.orderItems.map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "hover:bg-slate-50/50",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
													className: "p-3 font-bold text-slate-800 flex items-center gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.itemName }), item.isCustom && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "bg-amber-100 text-amber-800 text-[9px] font-extrabold px-2 py-0.5 rounded-full border border-amber-200",
														children: "Custom Item"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-3 text-center text-slate-600 font-semibold",
													children: item.serviceType
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-3 text-center font-mono font-extrabold text-slate-900",
													children: item.quantity
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-3 text-right font-mono text-slate-600",
													children: item.unitPrice ? `TShs ${item.unitPrice.toLocaleString()}/=` : "Pending"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-3 text-right font-mono font-bold text-blue-700",
													children: item.totalPrice ? `TShs ${item.totalPrice.toLocaleString()}/=` : "Pending Pricing"
												})
											]
										}, idx))
									})]
								})
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center text-xs text-slate-500 italic",
								children: "Standard Laundry Pickup — Item counts will be verified by the admin upon collection."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-slate-300 font-bold",
										children: student.adminVerified ? "Final Confirmed Amount:" : "Estimated Order Total:"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-2xl sm:text-3xl font-black text-amber-400 font-mono tracking-tight",
										children: [
											"TShs ",
											(student.adminConfirmedTotal || student.estimatedTotal || 0).toLocaleString(),
											"/="
										]
									}),
									!student.adminVerified && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-amber-300 font-medium mt-0.5",
										children: "* Final count & pricing will be confirmed by admin on receiving your clothes."
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/register",
									className: "w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-5 py-3 rounded-xl transition shadow-md",
									children: "+ Schedule Another Pickup Order"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 sm:grid-cols-4 gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex flex-col items-center text-center gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarCheck, { className: "h-6 w-6 text-blue-600" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-slate-400 font-semibold uppercase tracking-wider",
										children: "Scheduled Date"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-black text-slate-900",
										children: student.pickupDate ? (/* @__PURE__ */ new Date(student.pickupDate + "T00:00:00")).toLocaleDateString("en-GB", {
											weekday: "short",
											day: "numeric",
											month: "short"
										}) : "Standard"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex flex-col items-center text-center gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-6 w-6 text-teal-600" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-slate-400 font-semibold uppercase tracking-wider",
										children: "Time Window"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-black text-slate-900 leading-tight",
										children: student.pickupTimeSlot ? student.pickupTimeSlot.split(" ")[0] + " Slot" : "Morning"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-slate-500",
										children: student.pickupTimeSlot ? student.pickupTimeSlot.match(/\((.*?)\)/)?.[1] : "8AM - 11AM"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex flex-col items-center text-center gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shirt, { className: "h-6 w-6 text-indigo-600" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-slate-400 font-semibold uppercase tracking-wider",
										children: "Services"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-black text-slate-900 line-clamp-1",
										children: student.services?.join(", ") || "Washing & Ironing"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex flex-col items-center text-center gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-6 w-6 text-amber-500" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-slate-400 font-semibold uppercase tracking-wider",
										children: "Service Speed"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-black text-slate-900",
										children: student.serviceSpeed
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80 space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100",
									children: "💳 Payment & Till Information"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-lg font-black text-slate-900 mt-1",
									children: "Mobile Money Payment"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: `text-xs font-extrabold px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 self-start sm:self-auto border ${student.paymentStatus === "Paid" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : student.paymentStatus === "Verification Submitted" ? "bg-amber-50 text-amber-800 border-amber-200" : "bg-slate-100 text-slate-700 border-slate-200"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-2 w-2 rounded-full ${student.paymentStatus === "Paid" ? "bg-emerald-500" : student.paymentStatus === "Verification Submitted" ? "bg-amber-500 animate-pulse" : "bg-slate-400"}` }), student.paymentStatus === "Paid" ? "Paid & Confirmed" : student.paymentStatus === "Verification Submitted" ? "Verification Submitted" : "Payment Pending"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-rose-50/70 border border-rose-200/80 rounded-2xl p-4 space-y-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-black text-rose-900 uppercase tracking-wide",
												children: "🔴 M-Pesa Till"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] bg-rose-200 text-rose-900 font-bold px-2 py-0.5 rounded-full",
												children: "Lipa kwa M-Pesa"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-2xl font-black font-mono tracking-wider text-rose-950",
											children: "351752257"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[11px] text-rose-800 font-medium",
											children: ["Sample transaction code: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono font-bold text-rose-950",
												children: "DG4681NW4K"
											})]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-red-50/70 border border-red-200/80 rounded-2xl p-4 space-y-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-black text-red-900 uppercase tracking-wide",
												children: "🔴 Airtel Money Till"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] bg-red-200 text-red-900 font-bold px-2 py-0.5 rounded-full",
												children: "Lipa kwa Airtel"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-2xl font-black font-mono tracking-wider text-red-950",
											children: "655451652"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[11px] text-red-800 font-medium",
											children: ["Sample code: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono font-bold text-red-950",
												children: "TID:MP260728.2242.Z52912"
											})]
										})
									]
								})]
							}),
							student.paymentStatus !== "Paid" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: (e) => {
									e.preventDefault();
									setPaymentFeedback(null);
									const form = e.currentTarget;
									const method = form.elements.namedItem("method").value;
									const code = form.elements.namedItem("code").value.trim();
									if (!code && method !== "Cash") {
										setPaymentFeedback({
											type: "error",
											message: "Please enter your M-Pesa or Airtel Money transaction code."
										});
										return;
									}
									const updated = {
										...student,
										paymentMethod: method,
										transactionCode: code || "CASH",
										paymentStatus: "Verification Submitted",
										paymentDenialReason: void 0
									};
									saveStudent(updated);
									setStudent(updated);
									setPaymentFeedback({
										type: "success",
										message: "Payment transaction code submitted! Our admin team will verify your payment shortly."
									});
								},
								className: "mt-4 pt-4 border-t border-slate-100 space-y-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-bold text-slate-800",
										children: "Submit Payment Transaction Code for Admin Verification"
									}),
									student.paymentStatus === "Denied" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3.5 bg-rose-50 border-2 border-rose-300 text-rose-900 rounded-2xl text-xs font-semibold space-y-1 animate-fade-in",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2 text-rose-800 font-extrabold text-xs",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 text-rose-600 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "❌ Payment Transaction Code Denied by Admin" })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-rose-950 font-bold pl-6",
												children: ["Reason: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "underline decoration-rose-300",
													children: student.paymentDenialReason || "Invalid transaction code."
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[11px] text-rose-700 pl-6",
												children: "Please check your SMS receipt and re-enter the correct M-Pesa or Airtel Money code below for re-verification."
											})
										]
									}),
									paymentFeedback && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: `p-3 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fade-in ${paymentFeedback.type === "success" ? "bg-emerald-50 text-emerald-900 border border-emerald-200" : "bg-rose-50 text-rose-900 border border-rose-200"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: paymentFeedback.message })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col sm:flex-row gap-2.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												name: "method",
												defaultValue: student.paymentMethod || "M-Pesa",
												className: "px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "M-Pesa",
														children: "M-Pesa (Till 351752257)"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "Airtel Money",
														children: "Airtel Money (Till 655451652)"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "Cash",
														children: "Cash on Delivery"
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												name: "code",
												defaultValue: student.transactionCode || "",
												placeholder: "Enter Transaction Code e.g. DG4681NW4K",
												className: "flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono tracking-wide focus:outline-none focus:ring-2 focus:ring-blue-500"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "submit",
												className: "bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-sm cursor-pointer shrink-0",
												children: "Submit Payment Code →"
											})
										]
									}),
									student.transactionCode && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[11px] text-amber-700 font-semibold bg-amber-50 p-2.5 rounded-xl border border-amber-200",
										children: [
											"Submitted Transaction Code: ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono font-bold text-slate-900",
												children: student.transactionCode
											}),
											" (",
											student.paymentMethod || "M-Pesa",
											") — Pending admin verification."
										]
									})
								]
							}),
							student.paymentStatus === "Paid" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-emerald-600 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"Payment confirmed by admin via ",
									student.paymentMethod || "Mobile Money",
									". Thank you!"
								] })]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80 space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between border-b border-slate-100 pb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100",
									children: "⭐ Student Feedback & Review"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-lg font-black text-slate-900 mt-1",
									children: "Rate Your URBAN WASH Experience"
								})] }), student.rating && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full",
									children: [student.rating, " / 5 Stars Rated"]
								})]
							}),
							ratingFeedback && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fade-in",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-emerald-600 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: ratingFeedback })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: (e) => {
									e.preventDefault();
									setRatingFeedback(null);
									const form = e.currentTarget;
									const selectedStars = parseInt(form.elements.namedItem("starRating").value || "5", 10);
									const comment = form.elements.namedItem("comment").value.trim();
									const updated = {
										...student,
										rating: selectedStars,
										ratingComment: comment
									};
									saveStudent(updated);
									setStudent(updated);
									setRatingFeedback("Thank you for your rating! Your feedback helps us serve ATC students better.");
								},
								className: "space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-bold text-slate-700 mb-2",
										children: "Select Your Rating:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-center gap-2",
										children: [
											1,
											2,
											3,
											4,
											5
										].map((star) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "cursor-pointer group",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "radio",
												name: "starRating",
												value: star,
												defaultChecked: (student.rating || 5) === star,
												className: "sr-only peer"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-2xl text-slate-300 peer-checked:text-amber-400 group-hover:text-amber-300 transition",
												children: "★"
											})]
										}, star))
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-bold text-slate-700 mb-1",
										children: "Optional Feedback Comment:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										name: "comment",
										rows: 2,
										defaultValue: student.ratingComment || "",
										placeholder: "Tell us about the wash quality, speed, or ironing...",
										className: "w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "submit",
										className: "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-sm transition cursor-pointer",
										children: "Submit Star Rating ⭐"
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-indigo-800/40",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "bg-blue-500/20 text-blue-200 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-blue-500/30",
									children: "🎁 Referral Rewards Program"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `text-xs font-bold px-3 py-1 rounded-full ${refReward === "Unlocked" ? "bg-emerald-500/30 text-emerald-300 border border-emerald-500/30" : "bg-amber-500/20 text-amber-300 border border-amber-500/30"}`,
									children: refReward === "Unlocked" ? "🎉 FREE WASH UNLOCKED!" : `${refCount}/3 Friends Referred`
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-xl font-black mt-3",
								children: "Invite Friends & Earn Free Washes"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-blue-100 mt-1 leading-relaxed",
								children: [
									"Share your personal referral link with hostel mates. When 3 friends register, you unlock a ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "FREE wash for up to 5 clothes" }),
									" (worth TZS 2,500)!"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-5 bg-black/30 p-3.5 rounded-2xl border border-white/10 flex items-center justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-xs text-blue-200 truncate select-all",
									children: refLink
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: copyRefLink,
									className: "bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shrink-0 flex items-center gap-1.5 cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5" }), copied ? "Copied!" : "Copy"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex flex-col sm:flex-row gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: waShareLink,
									target: "_blank",
									rel: "noreferrer",
									className: "flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3 rounded-xl transition text-center flex items-center justify-center gap-1.5 shadow-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "h-4 w-4" }), "Share on WhatsApp Status"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/register",
									className: "bg-white/10 hover:bg-white/20 text-white font-bold text-xs py-3 px-5 rounded-xl transition text-center",
									children: "Schedule New Pickup 🧺"
								})]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { StudentDashboardPage as component };
