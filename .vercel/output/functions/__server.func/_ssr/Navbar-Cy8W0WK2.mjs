import { r as __toESM } from "../_runtime.mjs";
import { _ as useNavigate, g as Link, l as useLocation } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as loadStudents } from "./storage-Dnf1ak9H.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { E as LogOut, P as DollarSign, a as User, d as ShoppingBag, k as House, p as ShieldCheck, v as RefreshCw, w as MapPin, x as Phone } from "../_libs/lucide-react.mjs";
import { t as urban_logo_png_asset_default } from "./urban-logo.png.asset-w6TYKUb-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Navbar-Cy8W0WK2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Footer() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "relative mt-20 border-t border-blue-900/30 bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 text-white overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-24 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-24 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-6xl px-4 pt-12 pb-8 relative z-10 space-y-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 md:grid-cols-12 gap-8 items-start",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "md:col-span-5 space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: urban_logo_png_asset_default.url,
											alt: "Urban Wash",
											className: "h-10 w-auto drop-shadow-lg"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-extrabold text-teal-400 uppercase tracking-widest block",
											children: "Arusha Technical College"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-lg font-black text-white tracking-tight",
											children: "UrbanWash Connect"
										})] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-slate-300 leading-relaxed max-w-sm",
										children: "The official campus laundry platform for ATC students. Secure hostel pickup, express washing & machine drying with 100% anti-theft guarantee."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 pt-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 text-[10px] font-bold",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5 text-teal-400" }), "100% Anti-Theft Guaranteed"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20 text-[10px] font-bold",
											children: "⚡ Express Dispatch"
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "md:col-span-3 space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "text-xs font-black uppercase tracking-wider text-teal-400",
									children: "Quick Links"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
									className: "space-y-2 text-xs text-slate-300 font-medium",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: "/",
											className: "hover:text-white transition flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }), " Home Page"]
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: "/register",
											className: "hover:text-white transition flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }), " Schedule Pickup Order"]
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: "/pricing",
											className: "hover:text-white transition flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }), " Pricing & Discounts"]
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: "/login",
											className: "hover:text-white transition flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }), " Track My Laundry Order"]
										}) })
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "md:col-span-4 bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-bold text-amber-400 uppercase tracking-wider bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20",
										children: "💬 24/7 Hostel Support"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-slate-400 font-mono",
										children: "ATC Station"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: "https://wa.me/255687771750",
										target: "_blank",
										rel: "noreferrer",
										className: "w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs py-2.5 px-4 rounded-xl shadow-lg transition duration-200",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-4 w-4" }), "WhatsApp: +255 687 771 750"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-center gap-1 text-[11px] text-slate-300 font-medium pt-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3.5 w-3.5 text-rose-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Hostels 1 - 4 • ATC Campus Station" })]
									})]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs text-slate-400 font-medium",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"© ",
							(/* @__PURE__ */ new Date()).getFullYear(),
							" UrbanWash Connect. All rights reserved."
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "inline-flex items-center gap-2 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-400/20 px-4 py-2 rounded-2xl backdrop-blur-md shadow-lg hover:border-blue-400/40 transition",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-slate-300 text-xs",
								children: [
									"Developed by",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "bg-gradient-to-r from-cyan-400 via-blue-300 to-teal-300 bg-clip-text text-transparent font-black tracking-wider text-sm drop-shadow-sm",
										children: "FlexyTech"
									})
								]
							})
						})]
					})
				]
			})
		]
	});
}
function Navbar({ syncing = false }) {
	const location = useLocation();
	const navigate = useNavigate();
	const path = location.pathname;
	const [activeStudentName, setActiveStudentName] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		const activeId = localStorage.getItem("urbanwash_active_student");
		if (activeId) {
			const found = loadStudents().find((s) => s.customerId === activeId);
			if (found) setActiveStudentName(found.fullName.split(" ")[0]);
		}
	}, []);
	const handleLogout = () => {
		if (typeof window !== "undefined") localStorage.removeItem("urbanwash_active_student");
		setActiveStudentName(null);
		navigate({ to: "/login" });
	};
	const navLinks = [
		{
			label: "Home",
			href: "/",
			icon: House
		},
		{
			label: "Book Pickup",
			href: "/register",
			icon: ShoppingBag,
			badge: "Popular"
		},
		{
			label: "Pricing",
			href: "/pricing",
			icon: DollarSign
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "sticky top-0 z-40 w-full bg-slate-950/85 backdrop-blur-xl border-b border-blue-500/20 shadow-2xl shadow-slate-950/50 text-white transition-all",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl px-4 py-2.5 flex items-center justify-between gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-center gap-3 group shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: urban_logo_png_asset_default.url,
						alt: "Urban Wash",
						className: "h-10 sm:h-12 w-auto drop-shadow-md group-hover:scale-105 transition duration-300"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hidden sm:block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[9px] font-black text-teal-400 uppercase tracking-widest block leading-tight",
							children: "ATC Campus Official"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-black text-white tracking-tight group-hover:text-blue-300 transition",
							children: "UrbanWash Connect"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "hidden md:flex items-center gap-1.5 bg-white/5 border border-white/10 p-1.5 rounded-2xl backdrop-blur-md",
					children: navLinks.map((item) => {
						const Icon = item.icon;
						const isActive = path === item.href;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.href,
							className: `px-3.5 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 relative ${isActive ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-900/50" : "text-slate-300 hover:text-white hover:bg-white/10"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: `h-3.5 w-3.5 ${isActive ? "text-white" : "text-slate-400"}` }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.label }),
								item.badge && !isActive && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[9px] font-black bg-teal-400/20 text-teal-300 px-1.5 py-0.2 rounded-full border border-teal-400/30",
									children: item.badge
								})
							]
						}, item.href);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5 shrink-0",
					children: [syncing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-[10px] bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2.5 py-1 rounded-full flex items-center gap-1 font-bold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3 w-3 animate-spin text-teal-300" }), "Syncing"]
					}), activeStudentName ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/dashboard",
							className: "bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-black text-xs px-3.5 py-2 rounded-xl shadow-lg transition flex items-center gap-1.5 cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"Dashboard (",
								activeStudentName,
								")"
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handleLogout,
							className: "bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer",
							title: "Log Out",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Logout" })]
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/login",
						className: "bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer border border-blue-400/30",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Track / Login" })]
					})]
				})
			]
		})
	});
}
//#endregion
export { Navbar as n, Footer as t };
