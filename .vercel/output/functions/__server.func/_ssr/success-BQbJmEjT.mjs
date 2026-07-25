import { r as __toESM } from "../_runtime.mjs";
import { g as Link, v as useSearch } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as loadStudents } from "./storage-Dnf1ak9H.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { F as Copy, I as Clock, N as Download, R as CircleCheck, T as Mail, U as CalendarCheck, f as Shirt, h as Share2, v as RefreshCw, w as MapPin, x as Phone } from "../_libs/lucide-react.mjs";
import { t as urban_logo_png_asset_default } from "./urban-logo.png.asset-w6TYKUb-.mjs";
import { t as require_lib } from "../_libs/qrcode.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/success-BQbJmEjT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_lib = /* @__PURE__ */ __toESM(require_lib());
var WHATSAPP_CONTACT = "255687771750";
function Success() {
	const { id } = useSearch({ from: "/success" });
	const [student, setStudent] = (0, import_react.useState)(null);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const [flyerDownloading, setFlyerDownloading] = (0, import_react.useState)(false);
	const canvasRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		setStudent(loadStudents().find((s) => s.customerId === id) || null);
	}, [id]);
	const refLink = typeof window !== "undefined" ? `${window.location.origin}/register?ref=${id}` : `https://urbanwash.app/register?ref=${id}`;
	const shareText = `Hujambo! Jiunge na URBAN WASH 🧺 — washing, ironing & wash-iron services kwa wanafunzi. FREE pickup & delivery + 10% OFF order ya kwanza! Jisajili hapa: ${refLink}`;
	const waLink = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
	const smsLink = `sms:?&body=${encodeURIComponent(shareText)}`;
	const waUs = `https://wa.me/${WHATSAPP_CONTACT}?text=${encodeURIComponent(`Habari URBAN WASH, nimejisajili kwenye campaign! Jina langu ni ${student?.fullName ?? ""} (ID: ${id}). Nimechagua offer ya: ${student?.offer ?? "10% OFF First Order"}.`)}`;
	const [qrSvgUrl, setQrSvgUrl] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		import_lib.toDataURL(refLink, {
			color: {
				dark: "#1e3a8a",
				light: "#ffffff"
			},
			margin: 1
		}).then((url) => {
			setQrSvgUrl(url);
		}).catch((err) => {
			console.error(err);
		});
	}, [refLink]);
	function copy() {
		navigator.clipboard.writeText(refLink);
		setCopied(true);
		setTimeout(() => setCopied(false), 2e3);
	}
	const downloadFlyer = () => {
		setFlyerDownloading(true);
		const canvas = canvasRef.current;
		if (!canvas) {
			setFlyerDownloading(false);
			return;
		}
		const ctx = canvas.getContext("2d");
		if (!ctx) {
			setFlyerDownloading(false);
			return;
		}
		const drawAll = (img) => {
			canvas.width = 800;
			canvas.height = 1200;
			const grad = ctx.createLinearGradient(0, 0, 0, 1200);
			grad.addColorStop(0, "#1e40af");
			grad.addColorStop(.5, "#1d4ed8");
			grad.addColorStop(1, "#1e1b4b");
			ctx.fillStyle = grad;
			ctx.fillRect(0, 0, 800, 1200);
			ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
			ctx.beginPath();
			ctx.arc(700, 200, 250, 0, Math.PI * 2);
			ctx.fill();
			ctx.beginPath();
			ctx.arc(100, 950, 200, 0, Math.PI * 2);
			ctx.fill();
			ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
			ctx.lineWidth = 15;
			ctx.strokeRect(30, 30, 740, 1140);
			let textY = 190;
			if (img) {
				const logoWidth = 320;
				const logoHeight = img.height * (logoWidth / img.width);
				ctx.drawImage(img, 400 - logoWidth / 2, 60, logoWidth, logoHeight);
				textY = 60 + logoHeight + 30;
			} else {
				ctx.fillStyle = "#ffffff";
				ctx.textAlign = "center";
				ctx.font = "bold 56px Arial, Helvetica, sans-serif";
				ctx.fillText("URBAN WASH", 400, 140);
				ctx.fillStyle = "#60a5fa";
				ctx.font = "bold 24px Arial, sans-serif";
				ctx.fillText("WASH • IRONING • WASH & IRON", 400, 190);
				textY = 230;
			}
			ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
			ctx.fillRect(200, textY, 400, 3);
			ctx.fillStyle = "#22c55e";
			ctx.beginPath();
			ctx.roundRect(100, textY + 30, 600, 80, 16);
			ctx.fill();
			ctx.fillStyle = "#ffffff";
			ctx.textAlign = "center";
			ctx.font = "bold 30px Arial, sans-serif";
			ctx.fillText("🚚 FREE PICKUP & DELIVERY ALWAYS", 400, textY + 80);
			ctx.fillStyle = "#93c5fd";
			ctx.font = "italic 22px Georgia, serif";
			ctx.fillText("Professional Laundry, Delivered to Your Door", 400, textY + 150);
			ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
			ctx.beginPath();
			ctx.roundRect(80, textY + 190, 640, 260, 24);
			ctx.fill();
			ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
			ctx.lineWidth = 2;
			ctx.strokeRect(80, textY + 190, 640, 260);
			ctx.fillStyle = "#fbbf24";
			ctx.font = "black 76px Arial, sans-serif";
			ctx.fillText("10% OFF", 400, textY + 290);
			ctx.fillStyle = "#ffffff";
			ctx.font = "bold 32px Arial, sans-serif";
			ctx.fillText("ON YOUR FIRST ORDER", 400, textY + 340);
			ctx.fillStyle = "#93c5fd";
			ctx.font = "normal 20px Arial, sans-serif";
			ctx.fillText("Or choose iron/wash rewards upon registration!", 400, textY + 390);
			ctx.fillStyle = "#ffffff";
			ctx.font = "bold 26px Arial, sans-serif";
			ctx.fillText("REFER 3 FRIENDS & GET A FREE WASH", 400, textY + 500);
			ctx.fillStyle = "#93c5fd";
			ctx.font = "normal 18px Arial, sans-serif";
			ctx.fillText("(Get a free professional wash worth TZS 5,000)", 400, textY + 535);
			const qrY = textY + 575;
			ctx.fillStyle = "#ffffff";
			ctx.beginPath();
			ctx.roundRect(290, qrY, 220, 220, 16);
			ctx.fill();
			try {
				const qr = import_lib.create(refLink, { errorCorrectionLevel: "M" });
				const count = qr.modules.size;
				const cellSize = 180 / count;
				const startX = 310;
				const startY = qrY + 20;
				for (let r = 0; r < count; r++) for (let c = 0; c < count; c++) if (qr.modules.get(r, c)) {
					ctx.fillStyle = "#1e3a8a";
					ctx.fillRect(Math.floor(startX + c * cellSize), Math.floor(startY + r * cellSize), Math.ceil(cellSize), Math.ceil(cellSize));
				}
			} catch (err) {
				console.error("Canvas QR render error:", err);
				ctx.fillStyle = "#dc2626";
				ctx.font = "bold 20px Arial, sans-serif";
				ctx.fillText("Scan Link", 400, qrY + 110);
			}
			ctx.fillStyle = "#60a5fa";
			ctx.font = "bold 20px monospace";
			ctx.fillText("Scan QR to Register Instantly", 400, qrY + 250);
			ctx.fillStyle = "#ffffff";
			ctx.font = "normal 16px Arial, sans-serif";
			ctx.fillText("WhatsApp Campaign Support: +255 687 771 750", 400, qrY + 300);
			try {
				const url = canvas.toDataURL("image/png");
				const a = document.createElement("a");
				a.href = url;
				a.download = `urbanwash-share-${id}.png`;
				a.click();
			} catch (err) {
				console.error("Canvas export failed:", err);
			} finally {
				setFlyerDownloading(false);
			}
		};
		const img = new Image();
		img.crossOrigin = "anonymous";
		img.src = urban_logo_png_asset_default.url;
		img.onload = () => {
			drawAll(img);
		};
		img.onerror = () => {
			console.warn("Logo image failed to load for canvas flyer, falling back to text.");
			drawAll();
		};
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-slate-50 text-slate-800 font-sans pb-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "border-b border-blue-800/40 bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 text-white sticky top-0 z-20 shadow-md",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-2xl px-4 py-3 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "flex items-center gap-1.5 group",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: urban_logo_png_asset_default.url,
						alt: "Urban Wash",
						className: "h-9 w-auto drop-shadow group-hover:scale-105 transition duration-300"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-blue-200 font-semibold",
					children: "Student Portal"
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-2xl px-4 mt-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white rounded-3xl p-8 text-center shadow-md relative overflow-hidden",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-5xl animate-bounce",
							children: "🎉"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-4 text-2xl sm:text-3xl font-black tracking-tight",
							children: "Registration Successful!"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-blue-100 max-w-sm mx-auto leading-relaxed",
							children: "Congratulations! You are now registered with URBAN WASH."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 inline-flex flex-col items-center bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 shadow-inner",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xl sm:text-2xl font-black tracking-wider text-white",
								children: id || "UW-2026-0000"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-blue-200 mt-1 font-bold uppercase tracking-wider",
								children: "Your Customer ID"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 text-xs text-blue-200 font-medium",
							children: "🚚 FREE PICKUP & DELIVERY ALWAYS ON EVERY ORDER"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "font-black text-slate-900 text-base sm:text-lg",
								children: [
									"Hi ",
									student?.fullName?.split(" ")[0] ?? "Student",
									" 👋"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2.5 py-1 rounded-full border border-emerald-200",
								children: "✅ Pickup Booked"
							})]
						}),
						student?.leavingCampus === "Today" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-semibold leading-relaxed flex items-start gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-base",
								children: "🚨"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Priority Flagged:" }), " You marked you're leaving today — our dispatcher will coordinate your pickup as soon as possible!"] })]
						}),
						student?.leavingCampus && student.leavingCampus !== "Today" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4 p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl text-xs font-medium leading-relaxed flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "✈️" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"Leaving campus: ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: student.leavingCampus }),
								" — we'll schedule your pickup accordingly."
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 sm:grid-cols-4 gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col items-center text-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarCheck, { className: "h-5 w-5 text-blue-500" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] text-slate-500 font-semibold uppercase tracking-wider",
											children: "Next Pickup"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-black text-slate-900",
											children: student?.pickupDate ? (/* @__PURE__ */ new Date(student.pickupDate + "T00:00:00")).toLocaleDateString("en-GB", {
												weekday: "short",
												day: "numeric",
												month: "short"
											}) : "TBC"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-slate-500",
											children: student?.pickupTimeSlot ? student.pickupTimeSlot.split(" ")[0] + " Slot (" + student.pickupTimeSlot.match(/\((.*?)\)/)?.[1] + ")" : "9:00 AM"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col items-center text-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shirt, { className: "h-5 w-5 text-orange-500" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] text-slate-500 font-semibold uppercase tracking-wider",
											children: "Current Order"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-black text-slate-900",
											children: "🔥 Processing"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-slate-500",
											children: student?.serviceSpeed ?? "Standard"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col items-center text-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-5 w-5 text-teal-500" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] text-slate-500 font-semibold uppercase tracking-wider",
											children: "Est. Delivery"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-black text-slate-900",
											children: "Tomorrow"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-slate-500",
											children: student?.serviceSpeed === "Express" ? "4:00 PM" : "By evening"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col items-center text-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-5 w-5 text-indigo-500" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] text-slate-500 font-semibold uppercase tracking-wider",
											children: "Location"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-black text-slate-900",
											children: student?.hostel ?? "Hostel"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-slate-500",
											children: ["Room ", student?.room ?? "—"]
										})
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex flex-col sm:flex-row gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/dashboard",
								className: "flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm py-3.5 rounded-2xl shadow-md transition",
								children: "Open Live Student Dashboard 🚀"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: `https://wa.me/255687771750?text=${encodeURIComponent(`Habari URBAN WASH! Nataka kufuatilia order yangu. Jina langu: ${student?.fullName ?? ""}, ID: ${id}, Chumba: ${student?.hostel ?? ""} ${student?.room ?? ""}`)}`,
								target: "_blank",
								rel: "noreferrer",
								className: "flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm py-3.5 rounded-2xl shadow-sm transition",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-4 w-4" }), "WhatsApp Dispatcher"]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm",
					children: [
						student?.serviceSpeed === "Express" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4 p-3.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl text-[11px] font-semibold leading-relaxed animate-pulse",
							children: [
								"⚡ ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Express Order Alert:" }),
								" Priority processing requested (delivery within 4 hours). Our dispatcher will coordinate pickup immediately! (Express rates apply)"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "font-black text-slate-900 text-base sm:text-lg flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-emerald-500" }), "Benefits Unlocked"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-5 w-5 text-emerald-500 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sm font-semibold text-slate-800",
										children: ["🎁 Offer: ", student?.offer ?? "10% OFF First Order"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-slate-400 mt-0.5",
										children: "Applied automatically to your first laundry order."
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-5 w-5 text-emerald-500 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-semibold text-slate-800",
										children: "🚚 Free Pickup & Delivery Always"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-slate-400 mt-0.5",
										children: "Professional Laundry, Delivered to Your Door. No walking required."
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-5 w-5 text-emerald-500 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sm font-semibold text-slate-800",
										children: ["⏱️ Turnaround Speed: ", student?.serviceSpeed ?? "Standard"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-slate-400 mt-0.5",
										children: student?.serviceSpeed === "Express" ? "Express turnaround requested. Priority processing within 4 hours." : "Standard service (48 - 72 hours turnaround speed)."
									})] })]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-6 text-xs text-slate-500 leading-relaxed p-3 bg-slate-50 rounded-xl border border-slate-100",
							children: [
								"💬 ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "What's next?" }),
								" Our service team will reach out to you shortly via WhatsApp or SMS to coordinate your first pickup bundle!"
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] bg-indigo-500/30 text-indigo-200 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-indigo-500/20",
							children: "Share & Earn Free Washing"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-black text-xl sm:text-2xl mt-3",
							children: "Share with Friends & Earn Rewards"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-indigo-100 text-xs sm:text-sm leading-relaxed",
							children: [
								"Refer 3 students and receive a ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "FREE wash for up to 5 clothes" }),
								" (worth TZS 5,000). Every referral counts immediately after successful sign-up."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 bg-black/25 rounded-2xl p-4 border border-white/5 flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-mono break-all text-indigo-200 select-all tracking-tight",
								children: refLink
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: copy,
								className: "bg-white/10 hover:bg-white/20 active:scale-95 text-white p-2 rounded-xl transition shrink-0 border border-white/10",
								title: "Copy Referral Link",
								children: copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-bold text-emerald-400",
									children: "Copied!"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-4 w-4" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 grid grid-cols-3 gap-2.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: waLink,
									target: "_blank",
									rel: "noreferrer",
									className: "bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl font-bold text-xs sm:text-sm text-center shadow-sm transition flex items-center justify-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "h-3.5 w-3.5" }), "WhatsApp"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: smsLink,
									className: "bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-bold text-xs sm:text-sm text-center shadow-sm transition flex items-center justify-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3.5 w-3.5" }), "SMS Share"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: copy,
									className: "bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-2xl font-bold text-xs sm:text-sm text-center shadow-sm transition",
									children: copied ? "Link Copied!" : "Copy Link"
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-black text-slate-900 text-base sm:text-lg",
							children: "Promotional Share Card"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-500 mt-0.5",
							children: "Save this image to share on your WhatsApp status, Instagram stories, or Telegram channels to collect referrals!"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 border border-slate-200 rounded-2xl overflow-hidden bg-gradient-to-b from-blue-700 to-indigo-900 text-white p-6 relative max-w-sm mx-auto shadow-inner text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "font-extrabold text-2xl tracking-tight",
									children: "URBAN WASH"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-blue-300 font-bold uppercase tracking-widest mt-0.5",
									children: "Wash • Ironing • Wash & Iron"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-4 bg-emerald-600 text-white font-bold py-1.5 px-3 rounded-lg text-[10px] tracking-wide inline-block shadow-sm",
									children: "🚚 FREE PICKUP & DELIVERY ALWAYS"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 bg-white/5 border border-white/10 rounded-xl p-3.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-amber-400 text-3xl font-black leading-none",
										children: "10% OFF"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[9px] uppercase tracking-wider font-bold block mt-1",
										children: "FIRST ORDER FOR STUDENTS"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-4 text-[10px] text-blue-200",
									children: "Refer 3 Friends and Get a FREE Wash for Up to 5 Clothes"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-4 bg-white p-2 rounded-xl inline-block shadow-md",
									children: qrSvgUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: qrSvgUrl,
										alt: "Referral QR Code",
										className: "h-32 w-32"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-32 w-32 bg-slate-100 flex items-center justify-center text-slate-400 text-xs",
										children: "QR Loading..."
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[9px] text-slate-300 font-bold tracking-wider mt-2.5",
									children: "REGISTER NOW via QR Code"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[8px] text-slate-400 mt-2",
									children: "WhatsApp Contact: +255 687 771 750"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
							ref: canvasRef,
							className: "hidden"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 flex justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: downloadFlyer,
								disabled: flyerDownloading,
								className: "bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs py-3 px-6 rounded-xl transition flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-60",
								children: flyerDownloading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4 animate-spin" }), "Generating PNG..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" }), "Download Share Image (PNG)"] })
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 grid grid-cols-2 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/register",
						className: "bg-white border border-slate-200 hover:border-slate-300 text-slate-700 py-3.5 rounded-2xl font-bold text-center text-sm shadow-sm transition block",
						children: "Register Another Student"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: waUs,
						target: "_blank",
						rel: "noreferrer",
						className: "bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-2xl font-bold text-center text-sm shadow-sm transition flex items-center justify-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-4 w-4" }), "Open WhatsApp Chat"]
					})]
				})
			]
		})]
	});
}
//#endregion
export { Success as component };
