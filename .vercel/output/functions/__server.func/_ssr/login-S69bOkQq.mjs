import { r as __toESM } from "../_runtime.mjs";
import { _ as useNavigate, g as Link, v as useSearch } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as requestTempPinFn, f as saveStudent, p as syncWithCloud, u as loadStudents } from "./storage-Dnf1ak9H.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { B as CircleAlert, D as Lock, G as ArrowRight, O as Key, R as CircleCheck, n as X, v as RefreshCw, x as Phone } from "../_libs/lucide-react.mjs";
import { n as Navbar, t as Footer } from "./Navbar-Cy8W0WK2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-S69bOkQq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoginPage() {
	const navigate = useNavigate();
	const search = useSearch({ from: "/login" });
	const redirectPath = search.redirect || "/dashboard";
	const isScheduleIntent = search.intent === "schedule" || search.redirect === "/register";
	const [identifier, setIdentifier] = (0, import_react.useState)("");
	const [studentPin, setStudentPin] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [successMsg, setSuccessMsg] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [activeTab, setActiveTab] = (0, import_react.useState)("student");
	const [showForgotModal, setShowForgotModal] = (0, import_react.useState)(false);
	const [forgotPhone, setForgotPhone] = (0, import_react.useState)("");
	const [forgotLoading, setForgotLoading] = (0, import_react.useState)(false);
	const [forgotStatus, setForgotStatus] = (0, import_react.useState)(null);
	const [generatedTempPin, setGeneratedTempPin] = (0, import_react.useState)(null);
	const [modalPinInput, setModalPinInput] = (0, import_react.useState)("");
	const [showNewPinModal, setShowNewPinModal] = (0, import_react.useState)(false);
	const [loggedInStudent, setLoggedInStudent] = (0, import_react.useState)(null);
	const [newPin, setNewPin] = (0, import_react.useState)("");
	const [confirmPin, setConfirmPin] = (0, import_react.useState)("");
	const [pinUpdateError, setPinUpdateError] = (0, import_react.useState)("");
	const [staffPasscode, setStaffPasscode] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		syncWithCloud().catch((err) => console.error("Login page sync error:", err));
	}, []);
	async function handleRequestForgotPin(e) {
		e.preventDefault();
		setForgotStatus(null);
		setGeneratedTempPin(null);
		const inputPhone = forgotPhone.trim();
		if (!inputPhone) {
			setForgotStatus({
				type: "error",
				text: "Please enter your registered phone number."
			});
			return;
		}
		setForgotLoading(true);
		const clean = inputPhone.replace(/[^\d+]/g, "");
		const foundLocal = loadStudents().find((s) => {
			const matchPhone = s.phone.replace(/[^\d+]/g, "").endsWith(clean.slice(-8)) || s.whatsapp.replace(/[^\d+]/g, "").endsWith(clean.slice(-8));
			return clean.length >= 6 && matchPhone;
		});
		const tempPin = Math.floor(1e3 + Math.random() * 9e3).toString();
		if (foundLocal) saveStudent({
			...foundLocal,
			pinCode: tempPin,
			isTempPin: true
		});
		try {
			const res = await requestTempPinFn({ data: inputPhone });
			setForgotLoading(false);
			setGeneratedTempPin(res.tempPin || tempPin);
			setModalPinInput("");
			setForgotStatus({
				type: "success",
				text: `Temporary PIN dispatched via SMS to ${inputPhone}! Please check your phone messages and enter the 4-digit PIN below to log in.`
			});
			setIdentifier(inputPhone);
		} catch {
			setForgotLoading(false);
			setGeneratedTempPin(tempPin);
			setModalPinInput("");
			setForgotStatus({
				type: "success",
				text: `Temporary PIN dispatched via SMS to ${inputPhone}! Please check your phone messages and enter the 4-digit PIN below to log in.`
			});
			setIdentifier(inputPhone);
		}
	}
	function handleSaveNewPin(e) {
		e.preventDefault();
		setPinUpdateError("");
		if (!newPin || newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
			setPinUpdateError("Please enter a valid 4-digit PIN.");
			return;
		}
		if (newPin !== confirmPin) {
			setPinUpdateError("PIN codes do not match.");
			return;
		}
		if (loggedInStudent) {
			saveStudent({
				...loggedInStudent,
				pinCode: newPin,
				isTempPin: false
			});
			if (typeof window !== "undefined") localStorage.setItem("urbanwash_active_student", loggedInStudent.customerId);
			setShowNewPinModal(false);
			navigate({ to: redirectPath === "/register" ? "/register" : "/dashboard" });
		}
	}
	function executeLoginWithParams(phoneQuery, pinCode) {
		setError("");
		setSuccessMsg("");
		const query = phoneQuery.trim();
		const pin = pinCode.trim();
		if (!query) {
			setError("Please enter your registered phone number");
			return;
		}
		if (!pin) {
			setError("Please enter your 4-digit Security PIN");
			return;
		}
		if (pin.length !== 4) {
			setError("Security PIN must be exactly 4 digits");
			return;
		}
		setLoading(true);
		const clean = query.replace(/[^\d+]/g, "");
		const checkStudentAuth = (studentsList) => {
			const found = studentsList.find((s) => {
				const matchId = s.customerId.toLowerCase() === query.toLowerCase();
				const matchPhone = s.phone.replace(/[^\d+]/g, "").endsWith(clean.slice(-8)) || s.whatsapp.replace(/[^\d+]/g, "").endsWith(clean.slice(-8));
				return matchId || clean.length >= 6 && matchPhone;
			});
			if (!found) return {
				success: false,
				reason: "notFound"
			};
			if (found.pinCode && found.pinCode !== pin) return {
				success: false,
				reason: "wrongPin",
				student: found
			};
			return {
				success: true,
				student: found
			};
		};
		const processSuccessfulLogin = (student) => {
			if (typeof window !== "undefined") localStorage.setItem("urbanwash_active_student", student.customerId);
			setLoading(false);
			if (student.isTempPin) {
				setLoggedInStudent(student);
				setShowNewPinModal(true);
			} else navigate({ to: redirectPath === "/register" ? "/register" : "/dashboard" });
		};
		const localResult = checkStudentAuth(loadStudents());
		if (localResult.success && localResult.student) {
			processSuccessfulLogin(localResult.student);
			return;
		}
		if (localResult.reason === "wrongPin") {
			setLoading(false);
			setError("Incorrect 4-digit Security PIN for this phone number. Please try again.");
			return;
		}
		syncWithCloud().then((merged) => {
			const cloudResult = checkStudentAuth(merged);
			if (cloudResult.success && cloudResult.student) processSuccessfulLogin(cloudResult.student);
			else if (cloudResult.reason === "wrongPin") {
				setLoading(false);
				setError("Incorrect 4-digit Security PIN for this phone number. Please try again.");
			} else {
				setLoading(false);
				setError("No account found for this phone number. Please click Schedule Pickup below to register!");
			}
		}).catch(() => {
			setLoading(false);
			setError("Network error. Please try again or schedule a pickup!");
		});
	}
	function handleStudentLogin(e) {
		e.preventDefault();
		executeLoginWithParams(identifier, studentPin);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "flex-1 mx-auto max-w-md px-4 mt-10 w-full mb-12",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center mb-8 space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider",
								children: "🔐 Student Portal"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-2xl sm:text-3xl font-black tracking-tight text-slate-900",
								children: "Log In & Track Order"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs sm:text-sm text-slate-500",
								children: "Enter your registered phone number and 4-digit Security PIN"
							})
						]
					}),
					isScheduleIntent && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-6 p-4 bg-amber-50 border-2 border-amber-400 text-amber-900 rounded-2xl text-xs font-semibold flex items-start gap-3 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-5 w-5 text-amber-600 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-extrabold text-sm text-amber-900",
							children: "🔐 Login Required to Schedule Order"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-amber-800",
							children: [
								"Please log in with your registered phone number & 4-digit PIN first. If you don't have an account yet, click",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/register",
									className: "font-bold underline text-amber-950",
									children: "Register & Schedule"
								}),
								" ",
								"to create your account!"
							]
						})] })]
					}),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-medium flex items-start gap-2.5 animate-shake",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 text-rose-600 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-bold",
								children: error
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/register",
								className: "text-blue-700 underline font-bold block text-[11px] mt-1",
								children: "Click here to Register & Schedule Pickup →"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleStudentLogin,
						className: "bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-4 w-4 text-blue-500" }), "Student Phone Number"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "tel",
									inputMode: "tel",
									value: identifier,
									onChange: (e) => setIdentifier(e.target.value),
									placeholder: "e.g. 0712345678 or 06XXXXXXXX",
									className: "w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition text-sm shadow-inner",
									disabled: loading,
									autoComplete: "tel"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-slate-400 mt-2 leading-relaxed",
									children: "Enter the phone number you used when booking your laundry pickup."
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between mb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "text-xs font-bold text-slate-700 flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-4 w-4 text-indigo-500" }), "4-Digit Security PIN"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => {
											setForgotPhone(identifier);
											setForgotStatus(null);
											setShowForgotModal(true);
										},
										className: "text-[11px] text-blue-600 font-bold hover:underline cursor-pointer",
										children: "Forgot PIN? Reset Password"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "password",
									maxLength: 4,
									inputMode: "numeric",
									value: studentPin,
									onChange: (e) => setStudentPin(e.target.value.replace(/\D/g, "").slice(0, 4)),
									placeholder: "••••",
									className: "w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-800 font-mono tracking-widest text-center text-lg placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition shadow-inner",
									disabled: loading
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-slate-400 mt-2",
									children: "Enter the 4-digit PIN code you created during registration."
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: loading,
								className: "w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-2xl font-bold text-sm shadow-md hover:scale-[1.01] active:scale-[0.99] transition duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60",
								children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4 animate-spin" }), "Logging in..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Log In with Phone Number", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })] })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "pt-4 border-t border-slate-100 text-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-slate-500",
									children: [
										"Haven't scheduled a pickup yet?",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/register",
											className: "text-blue-600 font-bold hover:underline",
											children: "Schedule Pickup Now"
										})
									]
								})
							})
						]
					}),
					showForgotModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 relative",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setShowForgotModal(false),
									className: "absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 mb-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-10 w-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-5 w-5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-extrabold text-base text-slate-900",
										children: "Reset Security PIN"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-slate-500",
										children: "Receive a temporary PIN via SMS"
									})] })]
								}),
								forgotStatus && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `mb-4 p-3.5 rounded-2xl text-xs font-semibold leading-relaxed flex items-start gap-2 ${forgotStatus.type === "success" ? "bg-emerald-50 text-emerald-900 border border-emerald-200" : "bg-rose-50 text-rose-900 border border-rose-200"}`,
									children: [forgotStatus.type === "success" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-emerald-600 shrink-0 mt-0.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 text-rose-600 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: forgotStatus.text })]
								}),
								generatedTempPin ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
									onSubmit: (e) => {
										e.preventDefault();
										if (!modalPinInput || modalPinInput.length !== 4) {
											setForgotStatus({
												type: "error",
												text: "Please enter the 4-digit temporary PIN received via SMS."
											});
											return;
										}
										setStudentPin(modalPinInput);
										setIdentifier(forgotPhone);
										setShowForgotModal(false);
										executeLoginWithParams(forgotPhone, modalPinInput);
									},
									className: "space-y-4 pt-1 animate-fade-in",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-bold text-slate-800 mb-1.5",
										children: "Enter 4-Digit Temporary PIN Received via SMS:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "password",
										maxLength: 4,
										inputMode: "numeric",
										value: modalPinInput,
										onChange: (e) => setModalPinInput(e.target.value.replace(/\D/g, "").slice(0, 4)),
										placeholder: "••••",
										autoFocus: true,
										className: "w-full px-4 py-3 rounded-2xl border border-slate-300 text-center font-mono text-xl tracking-widest bg-white text-slate-900 font-black shadow-inner focus:outline-none focus:ring-4 focus:ring-blue-100"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-2 pt-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setShowForgotModal(false),
											className: "flex-1 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition",
											children: "Cancel"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "submit",
											className: "flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer",
											children: "Verify & Log In →"
										})]
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
									onSubmit: handleRequestForgotPin,
									className: "space-y-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-xs font-bold text-slate-700 mb-1",
											children: "Registered Phone Number"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "tel",
											value: forgotPhone,
											onChange: (e) => setForgotPhone(e.target.value),
											placeholder: "e.g. 0712345678",
											className: "w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500",
											disabled: forgotLoading
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[10px] text-slate-400 mt-1.5",
											children: [
												"We will send a temporary PIN SMS from sender ID ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "URBAN WASH" }),
												"."
											]
										})
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-2 pt-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setShowForgotModal(false),
											className: "flex-1 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition",
											children: "Cancel"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "submit",
											disabled: forgotLoading,
											className: "flex-1 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50",
											children: forgotLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5 animate-spin" }), "Sending..."] }) : "Send Temp PIN SMS"
										})]
									})]
								})
							]
						})
					}),
					showNewPinModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 mb-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-10 w-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Key, { className: "h-5 w-5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-extrabold text-base text-slate-900",
										children: "Create New Permanent PIN"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-slate-500",
										children: "Log in successful! Please set your new password."
									})] })]
								}),
								pinUpdateError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-semibold flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 text-rose-600 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: pinUpdateError })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
									onSubmit: handleSaveNewPin,
									className: "space-y-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-xs font-bold text-slate-700 mb-1",
											children: "New 4-Digit Security PIN"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "password",
											maxLength: 4,
											inputMode: "numeric",
											value: newPin,
											onChange: (e) => setNewPin(e.target.value.replace(/\D/g, "").slice(0, 4)),
											placeholder: "••••",
											className: "w-full px-4 py-3 rounded-2xl border border-slate-200 text-center font-mono text-lg tracking-widest"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-xs font-bold text-slate-700 mb-1",
											children: "Confirm New 4-Digit PIN"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "password",
											maxLength: 4,
											inputMode: "numeric",
											value: confirmPin,
											onChange: (e) => setConfirmPin(e.target.value.replace(/\D/g, "").slice(0, 4)),
											placeholder: "••••",
											className: "w-full px-4 py-3 rounded-2xl border border-slate-200 text-center font-mono text-lg tracking-widest"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "submit",
											className: "w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition",
											children: "Save New Password & Continue →"
										})
									]
								})
							]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { LoginPage as component };
