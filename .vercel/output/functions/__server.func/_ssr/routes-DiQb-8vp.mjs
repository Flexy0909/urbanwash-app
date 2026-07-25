import { r as __toESM } from "../_runtime.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { p as syncWithCloud, u as loadStudents } from "./storage-Dnf1ak9H.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { C as MessageSquare, G as ArrowRight, R as CircleCheck, U as CalendarCheck, V as ChevronRight, d as ShoppingBag, f as Shirt, n as X, o as Truck, p as ShieldCheck, r as Waves, w as MapPin, y as QrCode } from "../_libs/lucide-react.mjs";
import { n as Navbar, t as Footer } from "./Navbar-Cy8W0WK2.mjs";
import { t as require_lib } from "../_libs/qrcode.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DiQb-8vp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_lib = /* @__PURE__ */ __toESM(require_lib());
function useCounter(target, duration = 1800) {
	const [count, setCount] = (0, import_react.useState)(0);
	const rafRef = (0, import_react.useRef)(null);
	const startRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const animate = (ts) => {
			if (!startRef.current) startRef.current = ts;
			const elapsed = ts - startRef.current;
			const progress = Math.min(elapsed / duration, 1);
			const eased = 1 - Math.pow(1 - progress, 3);
			setCount(Math.floor(eased * target));
			if (progress < 1) rafRef.current = requestAnimationFrame(animate);
		};
		rafRef.current = requestAnimationFrame(animate);
		return () => {
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
		};
	}, [target, duration]);
	return count;
}
function StatCard({ emoji, value, isDecimal = false, suffix = "", label, accent }) {
	const count = useCounter(value);
	const displayVal = isDecimal ? (count / 10).toFixed(1) : count.toLocaleString();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `bg-white rounded-2xl p-5 shadow-sm border ${accent} flex flex-col items-center text-center gap-1 hover:shadow-md transition duration-300`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-3xl",
				children: emoji
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-2xl sm:text-3xl font-black text-slate-900 tabular-nums",
				children: [displayVal, suffix]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs text-slate-500 font-medium leading-tight",
				children: label
			})
		]
	});
}
function Landing() {
	const [syncStatus, setSyncStatus] = (0, import_react.useState)("idle");
	const [totalRecords, setTotalRecords] = (0, import_react.useState)(0);
	const [showFloating, setShowFloating] = (0, import_react.useState)(false);
	const [showQRModal, setShowQRModal] = (0, import_react.useState)(false);
	const [qrUrl, setQrUrl] = (0, import_react.useState)("https://urbanwash.app/register");
	(0, import_react.useEffect)(() => {
		if (typeof window !== "undefined") setQrUrl(`${window.location.origin}/register`);
	}, []);
	const [qrSvgUrl, setQrSvgUrl] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		import_lib.toDataURL(qrUrl, {
			color: {
				dark: "#1e3a8a",
				light: "#ffffff"
			},
			margin: 1
		}).then((url) => setQrSvgUrl(url)).catch((err) => console.error(err));
	}, [qrUrl]);
	(0, import_react.useEffect)(() => {
		setTotalRecords(loadStudents().length);
		setSyncStatus("syncing");
		syncWithCloud((merged) => {
			setTotalRecords(merged.length);
			setSyncStatus("success");
			setTimeout(() => setSyncStatus("idle"), 2e3);
		}).catch(() => {
			setSyncStatus("error");
			setTimeout(() => setSyncStatus("idle"), 3e3);
		});
	}, []);
	(0, import_react.useEffect)(() => {
		const onScroll = () => {
			setShowFloating(window.scrollY > 340);
		};
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	const baseOrders = Math.max(1284, totalRecords * 4);
	const clothesToday = 132 + totalRecords % 20;
	const pickupsToday = 18 + totalRecords % 7;
	`${encodeURIComponent("Habari! Nataka kufuatilia order yangu ya URBAN WASH. Customer ID yangu ni: ")}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-500 selection:text-white flex flex-col justify-between",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-rose-600 text-white text-xs sm:text-sm font-semibold py-2.5 px-4 text-center sticky top-0 z-30 shadow-sm flex items-center justify-center gap-2 flex-wrap",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "animate-pulse",
						children: "🚨"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Leaving campus soon? Book your laundry today and avoid last-minute delays." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/register",
						className: "underline underline-offset-2 font-bold hover:text-rose-200 transition whitespace-nowrap",
						children: "Book Now →"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, { syncing: syncStatus === "syncing" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white py-14 md:py-22 px-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-3xl pointer-events-none" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto max-w-4xl text-center relative z-10",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold tracking-wide uppercase backdrop-blur-sm border border-white/10",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3 w-3 text-blue-300" }), "Arusha Technical College"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "mt-5 text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight tracking-tight",
								children: [
									"Professional Laundry",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "bg-gradient-to-r from-blue-200 to-teal-100 bg-clip-text text-transparent",
										children: "for ATC Students"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-base sm:text-lg text-blue-100 max-w-2xl mx-auto font-normal leading-relaxed",
								children: "Fresh, crisp clothes delivered straight to your hostel room — no walking, no waiting in lines. Free pickup & delivery on every order."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-8 flex flex-col items-center gap-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "inline-flex items-center gap-2 bg-white/10 text-white/90 px-4 py-2 rounded-full font-semibold text-xs tracking-wide border border-white/10 backdrop-blur-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-4 w-4 text-teal-300 animate-bounce" }), "🚚 FREE PICKUP & DELIVERY — ALWAYS"]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-10 flex flex-col sm:flex-row justify-center items-center gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/register",
									id: "cta-schedule-pickup",
									className: "w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:scale-[1.03] active:scale-[0.97] transition duration-200 border border-emerald-400/30",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarCheck, { className: "h-5 w-5" }), "Schedule Pickup"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/login",
									id: "cta-track-order",
									className: "w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white/10 text-white hover:bg-white/20 border border-white/20 px-8 py-4 rounded-xl font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition duration-200 shadow-md",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-5 w-5 text-blue-200" }), "Track My Order"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-5 flex justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setShowQRModal(true),
									className: "inline-flex items-center gap-1.5 text-xs text-blue-200 hover:text-white transition cursor-pointer underline underline-offset-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "h-3.5 w-3.5" }), "Or scan QR code to register instantly"]
								})
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mx-auto max-w-5xl px-4 -mt-6 relative z-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-3xl shadow-lg border border-slate-100 p-6 md:p-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between mb-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" }), "Live Today's Statistics"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] text-slate-400 font-medium",
							children: "Updated in real time"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 md:grid-cols-4 gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
								emoji: "👕",
								value: clothesToday,
								label: "Clothes Washed Today",
								accent: "border-blue-100"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
								emoji: "🚚",
								value: pickupsToday,
								label: "Pickups Scheduled",
								accent: "border-teal-100"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
								emoji: "⭐",
								value: 49,
								isDecimal: true,
								suffix: "/5",
								label: "Student Rating",
								accent: "border-amber-100"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
								emoji: "⚡",
								value: 24,
								suffix: " hrs",
								label: "Average Delivery",
								accent: "border-indigo-100"
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mx-auto max-w-5xl px-4 mt-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 md:grid-cols-4 gap-4",
					children: [
						{
							value: `${baseOrders.toLocaleString()}+`,
							label: "Orders Completed",
							icon: "📦"
						},
						{
							value: "98%",
							label: "On-Time Delivery",
							icon: "⏱️"
						},
						{
							value: `${Math.max(350, totalRecords)}+`,
							label: "Registered Students",
							icon: "🎓"
						},
						{
							value: "★★★★★",
							label: "Student Reviews",
							icon: "💬"
						}
					].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-gradient-to-br from-blue-700 to-indigo-800 text-white rounded-2xl p-4 text-center shadow-md flex flex-col items-center gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-2xl",
								children: t.icon
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xl sm:text-2xl font-black tracking-tight",
								children: t.value
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-blue-200 font-medium leading-tight",
								children: t.label
							})
						]
					}, t.label))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-5xl px-4 py-12",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						id: "pricing",
						className: "text-center max-w-2xl mx-auto scroll-mt-28 space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider",
								children: "💰 Subsidized Student Rates"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight",
								children: "Transparent Pricing"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-slate-600 text-sm sm:text-base leading-relaxed",
								children: [
									"Commercial-grade laundry & steam ironing at affordable flat student rates. Always includes ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "100% FREE pickup & delivery" }),
									" straight to your hostel room."
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-10 grid sm:grid-cols-3 gap-6 items-stretch",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition duration-300 flex flex-col justify-between relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-center justify-between",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Waves, { className: "h-3.5 w-3.5" }), "Washing & Fold"]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-5 flex items-baseline gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-3xl sm:text-4xl font-black text-slate-900",
											children: "TZS 500"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-slate-500 font-medium",
											children: "/ item"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed",
										children: "Fresh machine wash, tumble dry, and neat hand folding."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-6 pt-5 border-t border-slate-100 space-y-2.5",
										children: [
											"Machine tumble dry & neat fold",
											"Eco-safe anti-bacterial detergent",
											"Individual load (Zero clothing mix-ups)",
											"FREE pickup & delivery to room"
										].map((feat, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-start gap-2 text-xs font-medium text-slate-700",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-emerald-500 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: feat })]
										}, i))
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-8 pt-4 border-t border-slate-100/80",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/register",
										className: "w-full inline-flex items-center justify-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs sm:text-sm py-3 px-4 rounded-xl transition duration-200",
										children: ["Schedule Wash & Fold", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80 hover:border-teal-300 hover:shadow-md transition duration-300 flex flex-col justify-between relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-center justify-between",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold border border-teal-100",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shirt, { className: "h-3.5 w-3.5" }), "Ironing Only"]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-5 flex items-baseline gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-3xl sm:text-4xl font-black text-slate-900",
											children: "TZS 500"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-slate-500 font-medium",
											children: "/ item"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed",
										children: "Crisp, wrinkle-free steam ironing to look sharp & confident."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-6 pt-5 border-t border-slate-100 space-y-2.5",
										children: [
											"High-temperature steam press",
											"Crisp crease & hanger ready",
											"Flat student rate for all items",
											"FREE pickup & delivery to room"
										].map((feat, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-start gap-2 text-xs font-medium text-slate-700",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-emerald-500 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: feat })]
										}, i))
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-8 pt-4 border-t border-slate-100/80",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/register",
										className: "w-full inline-flex items-center justify-center gap-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold text-xs sm:text-sm py-3 px-4 rounded-xl transition duration-200",
										children: ["Schedule Ironing", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-gradient-to-b from-blue-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl border-2 border-blue-500/80 flex flex-col justify-between relative transform sm:-translate-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-black text-[10px] uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md flex items-center gap-1 whitespace-nowrap",
										children: "🔥 MOST POPULAR • BEST VALUE"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex items-center justify-between",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-bold border border-blue-400/30",
												children: "Wash & Iron"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-5 flex items-baseline gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-3xl sm:text-4xl font-black text-white",
												children: "TZS 1,000"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs text-blue-200 font-medium",
												children: "/ item"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-3 text-xs sm:text-sm text-blue-100 leading-relaxed",
											children: "Complete care package (Full Wash + Tumble Dry + Steam Iron)."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-6 pt-5 border-t border-white/10 space-y-2.5",
											children: [
												"Full wash, tumble dry & steam iron",
												"Fabric softener & fresh fragrance",
												"FREE pickup & delivery to room",
												"Priority hostel dispatcher handling"
											].map((feat, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-start gap-2 text-xs font-medium text-blue-100",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-emerald-400 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: feat })]
											}, i))
										})
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-8 pt-4 border-t border-white/10",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: "/register",
											className: "w-full inline-flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-lg transition duration-200 border border-emerald-400/40",
											children: ["Book Complete Package", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
										})
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-center mt-10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/pricing",
							className: "inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm sm:text-base px-7 py-3.5 rounded-2xl shadow-md hover:scale-[1.02] active:scale-[0.98] transition duration-200",
							children: "View Full Student Price List 💰"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-3xl",
								children: "⚡"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "font-extrabold text-amber-900 text-sm sm:text-base",
								children: "Express Service Available!"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-amber-700 mt-0.5 leading-relaxed",
								children: [
									"In a rush? Get your laundry returned",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "within a few hours (up to 4 hours max)" }),
									" at an additional express rate. Perfect if you're leaving campus today!"
								]
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/register",
							search: { speed: "Express" },
							className: "w-full sm:w-auto shrink-0 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-sm text-center transition",
							children: "Order Express ⚡"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-12 bg-slate-900 text-white rounded-3xl p-6 md:p-10 shadow-lg border border-slate-800 relative overflow-hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-col md:flex-row items-center justify-between gap-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3 max-w-2xl",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider border border-blue-500/30",
										children: "🛡️ Commercial Laundry Standard"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-2xl font-extrabold text-white tracking-tight",
										children: "Professional Fabric Care. Exclusive Student Subsidized Rates."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-slate-300 leading-relaxed",
										children: "URBAN WASH operates commercial-grade laundry equipment with eco-safe detergent, anti-bacterial steam sanitization, and individual garment separation. We provide ATC students with subsidized flat rates without compromising professional quality."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2 text-xs font-semibold text-blue-200",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-emerald-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Individual Load Washing (Zero Clothing Mix-ups)" })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2 text-xs font-semibold text-blue-200",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-emerald-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Steam Ironed & Wrinkle-Free Folding" })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2 text-xs font-semibold text-blue-200",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-emerald-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Special Subsidized ATC Student Prices" })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2 text-xs font-semibold text-blue-200",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-emerald-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "100% Guaranteed Hygiene & Fabric Protection" })]
											})
										]
									})
								]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-12 bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-100",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid md:grid-cols-2 gap-8 items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-2xl font-black text-slate-900 tracking-tight",
									children: "Schedule Pickup & Unlock Exclusive Perks"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-slate-500 text-sm leading-relaxed",
									children: "Booking is free, takes less than a minute, and comes with immediate rewards."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-6 space-y-3.5",
									children: [
										"10% OFF your first order or free promotional wash rewards",
										"FREE pickup and delivery straight to your hostel room",
										"Exclusive WhatsApp promotions, reminders, and order tracking",
										"Join our student referral program and earn cash rewards or free washes"
									].map((b, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-5 w-5 text-emerald-500 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-slate-700 text-sm font-medium",
											children: b
										})]
									}, i))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-8 flex flex-col sm:flex-row gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/register",
										className: "inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3.5 rounded-xl shadow-md transition duration-200 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarCheck, { className: "h-4 w-4" }), "Schedule My Pickup"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => setShowQRModal(true),
										className: "inline-flex items-center justify-center gap-2 border border-blue-200 text-blue-700 hover:bg-blue-50 font-bold px-6 py-3.5 rounded-xl transition duration-200 text-sm cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "h-4 w-4" }), "Scan QR Code"]
									})]
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-gradient-to-br from-blue-50 to-indigo-50/60 rounded-3xl p-6 sm:p-7 border border-blue-100/80 relative overflow-hidden flex flex-col justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 text-blue-700 font-bold text-xs uppercase tracking-wider mb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-blue-600" }), "Student Quality Promise"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-lg font-black text-slate-900 tracking-tight",
										children: "Guaranteed Care & Cleanliness"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-xs text-slate-600 leading-relaxed",
										children: "We built URBAN WASH specifically around student needs. Every bag of laundry receives individual load handling and steam sanitization."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-4 space-y-2 text-xs text-slate-700 font-medium",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-emerald-600",
													children: "✓"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "100% Free Hostel Room Pickup & Delivery" })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-emerald-600",
													children: "✓"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Zero Garment Mix-ups (Isolated Washing)" })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-emerald-600",
													children: "✓"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Express 4-Hour Turnaround Available" })]
											})
										]
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-6 pt-4 border-t border-blue-100 text-[11px] text-blue-600 font-semibold flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "📍 Arusha Technical College" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "⭐ Rated 4.9 / 5" })]
								})]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-12 bg-gradient-to-br from-indigo-900 to-blue-800 text-white rounded-3xl p-6 md:p-8 shadow-md relative overflow-hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute -right-10 -bottom-10 opacity-10",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "h-48 w-48" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative z-10 max-w-xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "bg-blue-500/20 text-blue-200 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-blue-500/30",
									children: "Viral Growth System"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-3 text-2xl font-black",
									children: "Share with Friends & Earn Rewards"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 text-blue-100 text-sm leading-relaxed",
									children: [
										"Every registered student gets a unique referral code. When 3 friends register using your link, you unlock a ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "FREE wash for up to 5 clothes" }),
										" (worth TZS 2,500)!"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-6 flex flex-wrap gap-4 items-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/register",
										className: "bg-white text-indigo-900 font-bold px-5 py-2.5 rounded-lg text-xs hover:bg-slate-100 transition shadow-sm inline-flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarCheck, { className: "h-3.5 w-3.5" }), "Schedule & Get Referral Link"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-blue-200 font-mono",
										children: totalRecords > 0 ? `🔥 Join ${totalRecords} registered students` : ""
									})]
								})
							]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `fixed bottom-6 right-5 z-40 transition-all duration-500 ${showFloating ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/register",
					id: "floating-book-pickup",
					className: "flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-5 py-3.5 rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition duration-200 text-sm border border-emerald-400/30",
					children: ["🧺 Book Pickup", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })]
				})
			}),
			showQRModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full border border-slate-100 shadow-2xl relative text-center space-y-5 animate-scale-up",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setShowQRModal(false),
							className: "absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-14 w-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "h-7 w-7" })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-xl font-black text-slate-900 tracking-tight",
								children: "Scan to Schedule Pickup"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-slate-500",
								children: "Point your phone camera here to open the booking form instantly."
							})]
						}),
						qrSvgUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-center p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: qrSvgUrl,
								alt: "Scan to Register QR Code",
								className: "h-48 w-48 shadow-md rounded-xl"
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-rose-500 italic",
							children: "Failed to generate QR Code"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] text-slate-400 font-mono break-all font-semibold",
							children: qrUrl
						})
					]
				})
			})
		]
	});
}
//#endregion
export { Landing as component };
