"use client";

import {
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { toWords } from "number-to-words";
import MoneyReceiptTemplate from "@/components/MoneyReceiptTemplate";

const paymentModes = ["Cash", "Cheque", "NEFT/RTGS", "UPI", "Other"];
const paymentReferenceRules = {
  Cash: {
    maxLength: 30,
    allowedChars: /[^A-Z0-9/-]/g,
    pattern: /^[A-Z0-9][A-Z0-9/-]{0,29}$/,
    error:
      "Enter a cash receipt/reference number using up to 30 letters, numbers, /, or -.",
  },
  Cheque: {
    maxLength: 6,
    allowedChars: /\D/g,
    pattern: /^\d{6}$/,
    error: "Cheque number must contain exactly 6 digits.",
  },
  "NEFT/RTGS": {
    maxLength: 22,
    allowedChars: /[^A-Z0-9]/g,
    pattern: /^[A-Z0-9]{12,22}$/,
    error:
      "Enter a 12–22 character NEFT/RTGS UTR using letters and numbers only.",
  },
  UPI: {
    maxLength: 35,
    allowedChars: /\D/g,
    pattern: /^\d{12,35}$/,
    error: "Enter a 12–35 digit UPI transaction reference/UTR.",
  },
  Other: {
    maxLength: 100,
    allowedChars: /[^\p{L}\p{M}\d ./_-]/gu,
    pattern: /^[\p{L}\p{M}\d][\p{L}\p{M}\d ./_-]{2,99}$/u,
    error:
      "Enter a reference with 3–100 letters, numbers, spaces, or ./_- characters.",
  },
};

function sanitizePaymentReference(paymentMethod, rawValue) {
  const rule =
    paymentReferenceRules[paymentMethod] || paymentReferenceRules.Other;
  const value = String(rawValue ?? "")
    .toUpperCase()
    .replace(rule.allowedChars, "")
    .slice(0, rule.maxLength);
  if (paymentMethod === "Cash") return value.replace(/^[^A-Z0-9]+/, "");
  return paymentMethod === "Other"
    ? value.replace(/^[^\p{L}\p{M}\d]+/u, "")
    : value;
}

const emptyForm = {
  customer: {
    fullName: "",
    fatherHusbandName: "",
    mobileNumber: "",
    email: "",
    dateOfBirth: "",
    pan: "",
    aadhar: "",
    address: "",
  },
  property: {
    propertyType: "Residential Plot",
    unitPlotNumber: "",
    area: "",
    facing: "",
    plotSize: "",
  },
  payment: {
    bookingAmountPaid: "",
    totalPropertyValue: "",
    paymentMethod: "UPI",
    transactionId: "",
    paymentDate: new Date().toISOString().slice(0, 10),
    paymentPlan: "Plan A: 12 Months (No Interest)",
    bankBranch: "",
  },
};
const inputClass =
  "w-full border-0 border-b border-slate-400 bg-transparent px-1 py-2 text-sm text-slate-900 outline-none focus:border-emerald-900 focus:ring-0";
const requiredFields = new Set([
  "customer.fullName",
  "customer.mobileNumber",
  "customer.address",
  "property.unitPlotNumber",
  "property.area",
  "payment.bookingAmountPaid",
  "payment.transactionId",
  "payment.paymentDate",
  "payment.paymentPlan",
]);
const validationPaths = [
  ...[
    "fullName",
    "fatherHusbandName",
    "mobileNumber",
    "email",
    "dateOfBirth",
    "pan",
    "aadhar",
    "address",
  ].map((field) => `customer.${field}`),
  ...["unitPlotNumber", "area", "facing", "plotSize"].map(
    (field) => `property.${field}`,
  ),
  ...[
    "bookingAmountPaid",
    "totalPropertyValue",
    "paymentMethod",
    "transactionId",
    "paymentDate",
    "bankBranch",
    "paymentPlan",
  ].map((field) => `payment.${field}`),
];

function getFieldError(path, rawValue, paymentMethod) {
  const value = String(rawValue ?? "").trim();
  if (!value) return requiredFields.has(path) ? "This field is required." : "";

  switch (path) {
    case "customer.fullName":
    case "customer.fatherHusbandName":
      return /^[\p{L}\p{M}][\p{L}\p{M} .'-]{1,}$/u.test(value)
        ? ""
        : "Enter a name using letters, spaces, apostrophes, or hyphens.";
    case "customer.mobileNumber":
      return /^[6-9]\d{9}$/.test(value)
        ? ""
        : "Enter a valid 10-digit Indian mobile number.";
    case "customer.email":
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ? ""
        : "Enter a valid email address.";
    case "customer.dateOfBirth":
      return value <= new Date().toISOString().slice(0, 10)
        ? ""
        : "Date of birth cannot be in the future.";
    case "customer.pan":
      return /^[A-Z]{5}\d{4}[A-Z]$/.test(value)
        ? ""
        : "Enter a valid PAN (for example, ABCDE1234F).";
    case "customer.aadhar":
      return /^\d{12}$/.test(value)
        ? ""
        : "Aadhaar number must contain exactly 12 digits.";
    case "customer.address":
      return value.length >= 6
        ? ""
        : "Enter an address with at least 6 characters.";
    case "property.unitPlotNumber":
      return /^[\p{L}\p{M}\d][\p{L}\p{M}\d /.-]{0,24}$/u.test(value)
        ? ""
        : "Use up to 25 letters, numbers, spaces, hyphens, or slashes.";
    case "property.area":
    case "payment.bookingAmountPaid":
      return Number.isFinite(Number(value)) && Number(value) > 0
        ? ""
        : "Enter a number greater than zero.";
    case "property.plotSize":
    case "payment.totalPropertyValue":
      return Number.isFinite(Number(value)) && Number(value) >= 0
        ? ""
        : "Enter a valid area (zero or greater).";
    case "property.facing":
      return /^[\p{L}\p{M}\d .,'/-]{1,40}$/u.test(value)
        ? ""
        : "Enter a valid facing direction.";
    case "payment.paymentMethod":
      return paymentModes.includes(value)
        ? ""
        : "Select a listed payment method.";
    case "payment.transactionId": {
      const rule =
        paymentReferenceRules[paymentMethod] || paymentReferenceRules.Other;
      return rule.pattern.test(value) ? "" : rule.error;
    }
    case "payment.paymentDate":
      return /^\d{4}-\d{2}-\d{2}$/.test(value) &&
        value <= new Date().toISOString().slice(0, 10)
        ? ""
        : "Choose a valid date that is not in the future.";
    case "payment.bankBranch":
      return /^[\p{L}\p{M}\d .,'&()/-]{2,80}$/u.test(value)
        ? ""
        : "Enter a valid bank and branch name.";
    case "payment.paymentPlan":
      return value === "Other" ||
        (value.startsWith("Other:") && value.slice(6).trim().length < 3)
        ? "Please specify the other payment plan (at least 3 characters)."
        : "";
    default:
      return "";
  }
}

function Brand() {
  return (
    <div className="brand-lockup">
      <Image
        src="/logo.jpg"
        alt="Eco Vista Township"
        width={325}
        height={90}
        priority
      />
    </div>
  );
}

function Section({ number, title, children, className = "" }) {
  return (
    <section className={`booking-section ${className}`}>
      <h2>
        <span>
          {number}. {title}
        </span>
      </h2>
      {children}
    </section>
  );
}

function Field({
  label,
  children,
  className = "",
  path,
  error,
  validateField,
}) {
  const control = isValidElement(children)
    ? cloneElement(children, {
        "aria-invalid": Boolean(error),
        "aria-describedby": error ? `${path}-error` : undefined,
        onBlur: (event) => {
          children.props.onBlur?.(event);
          if (path) validateField(path, event.target.value);
        },
      })
    : children;

  return (
    <label className={`booking-field ${className}`}>
      <span className="field-label">{label}</span>
      {control}
      {error && (
        <small id={`${path}-error`} className="field-error" role="alert">
          {error}
        </small>
      )}
    </label>
  );
}

export default function BookingForm() {
  const [form, setForm] = useState(emptyForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [referralError, setReferralError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [submissionSucceeded, setSubmissionSucceeded] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [receiptDownloading, setReceiptDownloading] = useState(false);
  const [receiptDownloadError, setReceiptDownloadError] = useState("");
  const [bookingNumber, setBookingNumber] = useState("");
  const receiptRef = useRef(null);
  const makeBookingNumber = () => {
    const randomBytes = new Uint8Array(4);
    globalThis.crypto.getRandomValues(randomBytes);
    const suffix = Array.from(randomBytes, (byte) =>
      byte.toString(16).padStart(2, "0"),
    )
      .join("")
      .toUpperCase();
    return `EVB-${suffix}`;
  };
  useEffect(() => {
    const timer = window.setTimeout(
      () => setBookingNumber(makeBookingNumber()),
      0,
    );
    return () => window.clearTimeout(timer);
  }, []);
  const validateField = (path, value) => {
    const error = getFieldError(path, value, form.payment.paymentMethod);
    setFieldErrors((current) => {
      if (current[path] === error) return current;
      const next = { ...current };
      if (error) next[path] = error;
      else delete next[path];
      return next;
    });
    return error;
  };
  const fieldProps = (path) => ({
    path,
    error: fieldErrors[path],
    validateField,
  });
  const update = (section, field, value) => {
    const isPaymentMethodChange =
      section === "payment" && field === "paymentMethod";
    const nextValue =
      section === "payment" && field === "transactionId"
        ? sanitizePaymentReference(form.payment.paymentMethod, value)
        : value;
    const cleanedTransactionId = isPaymentMethodChange
      ? sanitizePaymentReference(value, form.payment.transactionId)
      : null;
    setForm((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [field]: nextValue,
        ...(isPaymentMethodChange
          ? { transactionId: cleanedTransactionId }
          : {}),
      },
    }));
    if (isPaymentMethodChange) {
      const transactionError = getFieldError(
        "payment.transactionId",
        cleanedTransactionId,
        value,
      );
      setFieldErrors((current) => {
        const next = { ...current };
        if (transactionError) next["payment.transactionId"] = transactionError;
        else delete next["payment.transactionId"];
        return next;
      });
    }
    validateField(`${section}.${field}`, nextValue);
  };
  const methodLabel = {
    Cash: "Cash Receipt / Reference No.",
    Cheque: "Cheque No.",
    "NEFT/RTGS": "NEFT / RTGS UTR No.",
    UPI: "UPI Transaction ID / UTR No.",
    Other: "Transaction / Reference No.",
  }[form.payment.paymentMethod];
  const amountInWords = form.payment.bookingAmountPaid
    ? `${toWords(Math.floor(Number(form.payment.bookingAmountPaid))).toUpperCase()} RUPEES ONLY`
    : "";

  const downloadReceipt = async (data) => {
    if (!receiptRef.current) {
      setReceiptDownloadError("Your receipt is still preparing. Please try again in a moment.");
      return;
    }
    setReceiptDownloading(true);
    setReceiptDownloadError("");
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      await html2pdf()
        .set({
          margin: 0,
          filename: `${data.receiptNo}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
          },
          jsPDF: {
            unit: "px",
            format: [1120, 760],
            orientation: "landscape",
          },
        })
        .from(receiptRef.current)
        .save();
    } catch (error) {
      console.error("Receipt download failed", error);
      setReceiptDownloadError(
        "The receipt could not be downloaded. Please try the button again or contact the office.",
      );
    } finally {
      setReceiptDownloading(false);
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    setSubmissionSucceeded(false);
    const errors = Object.fromEntries(
      validationPaths
        .map((path) => {
          const [section, field] = path.split(".");
          return [
            path,
            getFieldError(
              path,
              form[section][field],
              form.payment.paymentMethod,
            ),
          ];
        })
        .filter(([, error]) => error),
    );
    setFieldErrors(errors);
    if (!termsAccepted)
      setTermsError("Please confirm the booking declaration.");
    if (Object.keys(errors).length || !termsAccepted) return;
    if (!referralCode.trim()) {
      setReferralError("Please enter the referral code to continue.");
      return;
    }
    setReferralError("");
    if (!bookingNumber) {
      setMessage(
        "A booking form number is being generated. Please try again in a moment.",
      );
      return;
    }
    setSubmitting(true);
    setMessage("");
    try {
      const payload = {
        bookingNo: bookingNumber,
        referralCode: referralCode.trim().toUpperCase(),
        customer: form.customer,
        nominee: {},
        property: {
          ...form.property,
          projectName: "Eco Vista Township",
          projectLocation: "Dhanbad",
          area: Number(form.property.area),
        },
        payment: {
          ...form.payment,
          totalPropertyValue: form.payment.totalPropertyValue
            ? Number(form.payment.totalPropertyValue)
            : null,
          amountPaid: Number(form.payment.bookingAmountPaid),
          bookingAmountPaid: Number(form.payment.bookingAmountPaid),
          paymentStatus: "pending verification",
        },
        termsAccepted: true,
      };
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const booking = await response.json();
      if (response.status === 403) {
        setSubmissionSucceeded(false);
        setReferralError(
          "Referral code is wrong. Check the code and try again.",
        );
        setMessage("");
        return;
      }
      if (response.status === 409) setBookingNumber(makeBookingNumber());
      if (!response.ok)
        throw new Error(booking.error || "Unable to save booking details.");
      const savedBookingNumber = booking.bookingNo || bookingNumber;
      const downloadData = {
        ...payload,
        bookingNo: savedBookingNumber || booking._id,
        receiptNo:
          booking.receiptNo ||
          `BKR-${String(booking._id).slice(-8).toUpperCase()}`,
        paymentStatus: "Pending manual verification",
        amountWords: toWords(
          Math.floor(Number(payload.payment.bookingAmountPaid)),
        ).toUpperCase(),
        createdAt: booking.createdAt || new Date().toISOString(),
      };
      setReceiptData(downloadData);
      setReceiptDownloadError("");
      setSubmissionSucceeded(true);
      setShowConfetti(true);
      window.setTimeout(() => setShowConfetti(false), 2200);
      setMessage(
        "Your booking details were submitted. Your acknowledgment receipt is downloading now; payment remains subject to manual verification.",
      );
      setForm(emptyForm);
      setBookingNumber(makeBookingNumber());
      setReferralCode("");
      setReferralError("");
      setFieldErrors({});
      setTermsAccepted(false);
      setTermsError("");
      window.setTimeout(() => downloadReceipt(downloadData), 250);
    } catch (error) {
      setSubmissionSucceeded(false);
      setMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="booking-page">
      <article className="booking-sheet">
        <header className="form-header">
          <Brand />
          <h1>
            PLOT / SIMPLEX <em>BOOKING FORM</em>
          </h1>
          <p className="tagline">
            I N V E S T <b>|</b> B U I L D <b>|</b> B E L O N G
          </p>
          <div className="form-meta">
            <span>
              Booking Form No.: <b>{bookingNumber || "Generating…"}</b>
            </span>
            <span>
              Date: <b>{new Date().toLocaleDateString("en-IN")}</b>
            </span>
          </div>
        </header>
        <form onSubmit={submit} noValidate>
          <div className="property-type-bar">
            <strong>Property Type</strong>
            {["Residential Plot", "Simplex Private House (G+1)"].map((type) => (
              <label key={type}>
                <input
                  type="radio"
                  name="propertyType"
                  checked={form.property.propertyType === type}
                  onChange={() => update("property", "propertyType", type)}
                />
                {type}
              </label>
            ))}
          </div>
          <Section number="1" title="Customer Details">
            <div className="booking-grid customer-grid">
              <Field label="Full Name *" {...fieldProps("customer.fullName")}>
                <input
                  className={inputClass}
                  required
                  value={form.customer.fullName}
                  onChange={(e) =>
                    update("customer", "fullName", e.target.value)
                  }
                />
              </Field>
              <Field
                label="Date of Birth"
                {...fieldProps("customer.dateOfBirth")}
              >
                <input
                  className={inputClass}
                  type="date"
                  max={new Date().toISOString().slice(0, 10)}
                  value={form.customer.dateOfBirth}
                  onChange={(e) =>
                    update("customer", "dateOfBirth", e.target.value)
                  }
                />
              </Field>
              <Field
                label="Father’s / Spouse’s Name"
                {...fieldProps("customer.fatherHusbandName")}
              >
                <input
                  className={inputClass}
                  value={form.customer.fatherHusbandName}
                  onChange={(e) =>
                    update("customer", "fatherHusbandName", e.target.value)
                  }
                />
              </Field>
              <Field label="PAN No." {...fieldProps("customer.pan")}>
                <input
                  className={inputClass}
                  maxLength={10}
                  placeholder="ABCDE1234F"
                  autoCapitalize="characters"
                  value={form.customer.pan}
                  onChange={(e) =>
                    update("customer", "pan", e.target.value.toUpperCase())
                  }
                />
              </Field>
              <Field
                label="Mobile No. *"
                {...fieldProps("customer.mobileNumber")}
              >
                <input
                  className={inputClass}
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  required
                  value={form.customer.mobileNumber}
                  onChange={(e) =>
                    update("customer", "mobileNumber", e.target.value)
                  }
                />
              </Field>
              <Field label="Aadhaar No." {...fieldProps("customer.aadhar")}>
                <input
                  className={inputClass}
                  inputMode="numeric"
                  maxLength={12}
                  value={form.customer.aadhar}
                  onChange={(e) => update("customer", "aadhar", e.target.value)}
                />
              </Field>
              <Field label="Email ID" {...fieldProps("customer.email")}>
                <input
                  className={inputClass}
                  type="email"
                  value={form.customer.email}
                  onChange={(e) => update("customer", "email", e.target.value)}
                />
              </Field>
              <Field
                label="Address *"
                className="full-width"
                {...fieldProps("customer.address")}
              >
                <input
                  className={inputClass}
                  required
                  value={form.customer.address}
                  onChange={(e) =>
                    update("customer", "address", e.target.value)
                  }
                />
              </Field>
            </div>
          </Section>
          <Section
            number="2"
            title="Property Details"
            className="property-details"
          >
            <div className="booking-grid">
              <Field label="Project" className="full-width">
                <input
                  className={inputClass}
                  readOnly
                  value="Eco Vista Township, Dhanbad"
                />
              </Field>
              <Field
                label="Plot / Unit No. *"
                {...fieldProps("property.unitPlotNumber")}
              >
                <input
                  className={inputClass}
                  placeholder="Enter plot or unit number"
                  required
                  value={form.property.unitPlotNumber}
                  onChange={(e) =>
                    update("property", "unitPlotNumber", e.target.value)
                  }
                />
              </Field>
              <Field label="Facing" {...fieldProps("property.facing")}>
                <input
                  className={inputClass}
                  placeholder="e.g. North, South"
                  value={form.property.facing}
                  onChange={(e) => update("property", "facing", e.target.value)}
                />
              </Field>
              <Field
                label="Plot Area (Sq. Ft.) *"
                {...fieldProps("property.area")}
              >
                <input
                  className={inputClass}
                  type="number"
                  min="1"
                  step="any"
                  placeholder="Enter plot area"
                  required
                  value={form.property.area}
                  onChange={(e) => update("property", "area", e.target.value)}
                />
              </Field>
              <Field
                label="Total Price (₹)"
                {...fieldProps("payment.totalPropertyValue")}
              >
                <input
                  className={inputClass}
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Enter total price"
                  value={form.payment.totalPropertyValue}
                  onChange={(e) =>
                    update("payment", "totalPropertyValue", e.target.value)
                  }
                />
              </Field>
              <div className="booking-field simplex-type-field">
                <span className="field-label">Type (if Simplex)</span>
                <label className="simplex-choice">
                  <input
                    type="checkbox"
                    checked={
                      form.property.propertyType ===
                      "Simplex Private House (G+1)"
                    }
                    onChange={(e) =>
                      update(
                        "property",
                        "propertyType",
                        e.target.checked
                          ? "Simplex Private House (G+1)"
                          : "Residential Plot",
                      )
                    }
                  />
                  G+1 Simplex
                </label>
              </div>
              <Field
                label="Built-up Area (Sq. Ft.)"
                {...fieldProps("property.plotSize")}
              >
                <input
                  className={inputClass}
                  type="number"
                  min="0"
                  step="any"
                  placeholder="Enter built-up area"
                  value={form.property.plotSize}
                  onChange={(e) =>
                    update("property", "plotSize", e.target.value)
                  }
                />
              </Field>
            </div>
          </Section>
          <div className="payment-grid">
            <Section number="3" title="Booking Payment Details">
              <div className="booking-grid single-grid">
                <Field
                  label="Booking Amount (₹) *"
                  {...fieldProps("payment.bookingAmountPaid")}
                >
                  <input
                    className={inputClass}
                    type="number"
                    min="1"
                    step="0.01"
                    required
                    value={form.payment.bookingAmountPaid}
                    onChange={(e) =>
                      update("payment", "bookingAmountPaid", e.target.value)
                    }
                  />
                </Field>
                <Field label="Amount in Words">
                  <input
                    className={inputClass}
                    readOnly
                    value={amountInWords}
                  />
                </Field>
                <Field
                  label="Payment Mode *"
                  {...fieldProps("payment.paymentMethod")}
                >
                  <select
                    className={inputClass}
                    value={form.payment.paymentMethod}
                    onChange={(e) =>
                      update("payment", "paymentMethod", e.target.value)
                    }
                  >
                    {paymentModes.map((mode) => (
                      <option key={mode}>{mode}</option>
                    ))}
                  </select>
                </Field>
                <Field
                  label={`${methodLabel} *`}
                  {...fieldProps("payment.transactionId")}
                >
                  <input
                    className={inputClass}
                    required
                    maxLength={
                      paymentReferenceRules[form.payment.paymentMethod]
                        .maxLength
                    }
                    inputMode={
                      ["Cheque", "UPI"].includes(form.payment.paymentMethod)
                        ? "numeric"
                        : "text"
                    }
                    autoCapitalize="characters"
                    placeholder={
                      {
                        Cash: "Cash receipt/reference number",
                        Cheque: "6 digit cheque number",
                        "NEFT/RTGS": "Bank UTR (12–22 characters)",
                        UPI: "UPI transaction ID / UTR",
                        Other: "Transaction/reference number",
                      }[form.payment.paymentMethod]
                    }
                    value={form.payment.transactionId}
                    onChange={(e) =>
                      update("payment", "transactionId", e.target.value)
                    }
                  />
                </Field>
                <Field
                  label="Bank & Branch (if any)"
                  {...fieldProps("payment.bankBranch")}
                >
                  <input
                    className={inputClass}
                    value={form.payment.bankBranch}
                    onChange={(e) =>
                      update("payment", "bankBranch", e.target.value)
                    }
                  />
                </Field>
                <Field
                  label="Transaction Date *"
                  {...fieldProps("payment.paymentDate")}
                >
                  <input
                    className={inputClass}
                    type="date"
                    max={new Date().toISOString().slice(0, 10)}
                    required
                    value={form.payment.paymentDate}
                    onChange={(e) =>
                      update("payment", "paymentDate", e.target.value)
                    }
                  />
                </Field>
              </div>
            </Section>
            <Section number="4" title="Preferred Payment Plan">
              <div className="plan-list">
                {[
                  "Plan A: 12 Months (No Interest)",
                  "Plan B: 24 Months (+5% on Balance)",
                  "Plan C: Beyond 24 Months (+10% on Balance)",
                  "Other",
                ].map((plan) => (
                  <label
                    key={plan}
                    className={plan === "Other" ? "plan-other" : undefined}
                  >
                    <input
                      type="radio"
                      name="paymentPlan"
                      checked={
                        form.payment.paymentPlan === plan ||
                        (plan === "Other" &&
                          form.payment.paymentPlan.startsWith("Other:"))
                      }
                      onChange={() => update("payment", "paymentPlan", plan)}
                    />
                    {plan === "Other" ? (
                      <>
                        <b>Other:</b>
                        <input
                          className={inputClass}
                          placeholder="Specify plan"
                          value={
                            form.payment.paymentPlan.startsWith("Other:")
                              ? form.payment.paymentPlan.slice(6).trim()
                              : ""
                          }
                          aria-invalid={Boolean(
                            fieldErrors["payment.paymentPlan"],
                          )}
                          aria-describedby={
                            fieldErrors["payment.paymentPlan"]
                              ? "payment.paymentPlan-error"
                              : undefined
                          }
                          onBlur={() =>
                            validateField(
                              "payment.paymentPlan",
                              form.payment.paymentPlan,
                            )
                          }
                          onChange={(e) =>
                            update(
                              "payment",
                              "paymentPlan",
                              e.target.value
                                ? `Other: ${e.target.value}`
                                : "Other",
                            )
                          }
                        />
                      </>
                    ) : (
                      plan
                    )}
                    {plan === "Other" && fieldErrors["payment.paymentPlan"] && (
                      <small
                        id="payment.paymentPlan-error"
                        className="plan-error"
                        role="alert"
                      >
                        {fieldErrors["payment.paymentPlan"]}
                      </small>
                    )}
                  </label>
                ))}
              </div>
            </Section>
          </div>
          <Section number="5" title="Declaration">
            <p className="declaration-copy">
              I/We hereby confirm that the above information is true and
              correct. I/We have read and understood the terms and conditions of
              booking, including the payment plan, applicable charges (EDC, PLC,
              etc.), cancellation and refund policy, and agree to abide by the
              same.
            </p>
            <label className="terms-check">
              <input
                type="checkbox"
                required
                checked={termsAccepted}
                aria-invalid={Boolean(termsError)}
                aria-describedby={termsError ? "terms-error" : undefined}
                onChange={(e) => {
                  setTermsAccepted(e.target.checked);
                  setTermsError(
                    e.target.checked
                      ? ""
                      : "Please confirm the booking declaration.",
                  );
                }}
              />
              I confirm that the information provided is accurate and agree to
              the booking terms.
            </label>
            {termsError && (
              <p id="terms-error" className="terms-error" role="alert">
                {termsError}
              </p>
            )}
          </Section>
          <Section number="6" title="Referral Code">
            <div className="referral-entry">
              <label htmlFor="referral-code">Enter referral code *</label>
              <input
                id="referral-code"
                className={`${inputClass} referral-code-input`}
                type="text"
                autoComplete="off"
                autoCapitalize="characters"
                maxLength={24}
                required
                value={referralCode}
                aria-invalid={Boolean(referralError)}
                aria-describedby={
                  referralError ? "referral-code-error" : "referral-code-help"
                }
                onChange={(event) => {
                  setReferralCode(event.target.value.toUpperCase());
                  setReferralError("");
                  setMessage("");
                }}
              />
              <small id="referral-code-help" className="referral-code-help">
                Enter the referral code provided to you.
              </small>
              {referralError && (
                <p
                  id="referral-code-error"
                  className="referral-error"
                  role="alert"
                >
                  <span aria-hidden="true">!</span>
                  {referralError}
                </p>
              )}
            </div>
          </Section>
          <footer className="form-footer">
            <span>
              📍 Sriram Complex, Mayur Hotel, Nawadih, Hirak Road,
              <br />
              Dhanbad, Jharkhand – 828130
            </span>
          </footer>
          {message && !submissionSucceeded && (
            <div
              className={`form-message${submissionSucceeded ? " form-message-success" : ""}`}
              role="status"
              aria-live="polite"
            >
              {submissionSucceeded && (
                <span className="form-message-success-icon" aria-hidden="true">
                  ✓
                </span>
              )}
              <span>
                {submissionSucceeded && <strong>Booking submitted successfully!</strong>}
                {message}
              </span>
            </div>
          )}
          <button className="submit-booking" disabled={submitting}>
            {submitting ? "SUBMITTING…" : "SUBMIT BOOKING & DOWNLOAD RECEIPT"}
          </button>
          {showConfetti && (
            <div
              className="success-confetti"
              aria-label="Booking submitted successfully"
            >
              {[
                "#e0b42f",
                "#0d3424",
                "#e77d45",
                "#6d9b75",
                "#e0b42f",
                "#0d3424",
                "#e77d45",
                "#6d9b75",
                "#e0b42f",
                "#0d3424",
                "#e77d45",
                "#6d9b75",
              ].map((color, index) => (
                <i
                  key={`${color}-${index}`}
                  style={{
                    "--confetti-delay": `${index * 18}ms`,
                    "--confetti-color": color,
                    "--confetti-x": `${(index - 5.5) * 13}px`,
                    "--confetti-rotation": `${index * 83}deg`,
                  }}
                />
              ))}
            </div>
          )}
        </form>
      </article>
      {submissionSucceeded && (
        <div className="success-modal-backdrop">
          <section
            className="success-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-success-title"
          >
            <div className="success-modal-icon" aria-hidden="true">✓</div>
            <p className="success-modal-eyebrow">Eco Vista Township</p>
            <h2 id="booking-success-title">Form successfully submitted!</h2>
            <p className="success-modal-copy">
              Your booking has been received. Your receipt should download automatically.
              If it did not, use the button below to download it.
            </p>
            {receiptDownloadError && (
              <p className="success-modal-error" role="alert">
                {receiptDownloadError}
              </p>
            )}
            <button
              className="success-modal-download"
              type="button"
              onClick={() => downloadReceipt(receiptData)}
              disabled={receiptDownloading || !receiptData}
            >
              {receiptDownloading ? "PREPARING RECEIPT…" : "DOWNLOAD RECEIPT"}
            </button>
            <button
              className="success-modal-close"
              type="button"
              onClick={() => {
                setSubmissionSucceeded(false);
                setMessage("");
              }}
            >
              Close
            </button>
          </section>
        </div>
      )}
      <div className="receipt-download-stage" aria-hidden="true">
        {receiptData && (
          <MoneyReceiptTemplate ref={receiptRef} data={receiptData} />
        )}
      </div>
    </main>
  );
}
