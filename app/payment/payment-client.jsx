"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import MoneyReceiptTemplate from "@/components/MoneyReceiptTemplate";
import { toWords } from "number-to-words";

// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// Receipt generation function
// const generateReceiptPDF = async (paymentData, bookingDetails, bookingId) => {
//   // Fetch complete booking data from Supabase
//   let fullBookingData = null;
//   try {
//     const { data, error } = await supabaseBrowser
//       .from("bookings")
//       .select("*")
//       .eq("id", bookingId)
//       .single();

//     if (!error && data) {
//       fullBookingData = data;
//     }
//   } catch (error) {
//     console.error("Error fetching booking data:", error);
//   }

//   const doc = new jsPDF();

//   // ========== HEADER SECTION ==========
//   // Company Header with Logo Space
//   doc.setFillColor(219, 7, 29);
//   doc.rect(0, 0, 210, 30, 'F');

//   doc.setFontSize(28);
//   doc.setTextColor(255, 255, 255);
//   doc.text("REAL ESTATES OPPORTUNITY", 105, 18, { align: 'center' });

//   doc.setFontSize(12);
//   doc.setTextColor(255, 255, 255, 0.9);
//   doc.text("OFFICIAL PAYMENT RECEIPT", 105, 26, { align: 'center' });

//   // ========== RECEIPT TITLE ==========
//   doc.setFontSize(20);
//   doc.setTextColor(0, 0, 0);
//   doc.text("PAYMENT CONFIRMATION", 105, 45, { align: 'center' });

//   // ========== RECEIPT INFO SECTION ==========
//   doc.setFontSize(10);
//   doc.setTextColor(100, 100, 100);

//   // Receipt Number with box
//   doc.setFillColor(245, 245, 245);
//   doc.roundedRect(20, 52, 80, 12, 3, 3, 'F');
//   doc.setTextColor(219, 7, 29);
//   doc.setFont(undefined, 'bold');
//   doc.text(`Receipt No: ${paymentData.transactionId}`, 25, 60);

//   // Date with box
//   doc.setFillColor(245, 245, 245);
//   doc.roundedRect(110, 52, 80, 12, 3, 3, 'F');
//   doc.setTextColor(219, 7, 29);
//   doc.setFont(undefined, 'bold');
//   doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, 115, 60);

//   // Reset font
//   doc.setFont(undefined, 'normal');

//   // ========== PAYMENT AMOUNT HIGHLIGHT ==========
//   doc.setFillColor(250, 250, 250);
//   doc.roundedRect(20, 70, 170, 25, 5, 5, 'F');
//   doc.setDrawColor(219, 7, 29);
//   doc.setLineWidth(0.5);
//   doc.roundedRect(20, 70, 170, 25, 5, 5, 'S');

//   doc.setFontSize(14);
//   doc.setTextColor(100, 100, 100);
//   doc.text("PAYMENT AMOUNT", 105, 80, { align: 'center' });

//   doc.setFontSize(24);
//   doc.setTextColor(219, 7, 29);
//   doc.setFont(undefined, 'bold');
//   doc.text(`₹${Number(paymentData.amountPaid).toLocaleString('en-IN')}`, 105, 90, { align: 'center' });

//   doc.setFontSize(10);
//   doc.setTextColor(100, 100, 100);
//   doc.setFont(undefined, 'normal');
//   doc.text("SUCCESSFULLY PAID", 105, 95, { align: 'center' });

//   // ========== CUSTOMER DETAILS SECTION ==========
//   let startY = 105;

//   if (fullBookingData) {
//     doc.setFontSize(12);
//     doc.setTextColor(50, 50, 50);
//     doc.setFont(undefined, 'bold');
//     doc.text("CUSTOMER DETAILS", 20, startY);

//     startY += 8;

//     autoTable(doc, {
//       startY: startY,
//       head: [['Field', 'Information']],
//       body: [
//         ['Full Name', fullBookingData.full_name || ''],
//         ['Father/Husband Name', fullBookingData.father_husband_name || ''],
//         ['Mobile Number', fullBookingData.mobile_number || ''],
//         ['Email ID', fullBookingData.email || ''],
//         ['PAN Number', fullBookingData.pan || ''],
//         ['Aadhar Number', fullBookingData.aadhar || ''],
//         ['Address', fullBookingData.address || ''],
//         ['City/State', `${fullBookingData.city || ''}, ${fullBookingData.state || ''}`],
//       ],
//       theme: 'grid',
//       headStyles: {
//         fillColor: [219, 7, 29],
//         textColor: [255, 255, 255],
//         fontSize: 9,
//         fontStyle: 'bold'
//       },
//       styles: {
//         fontSize: 9,
//         cellPadding: 2
//       },
//       columnStyles: {
//         0: { cellWidth: 45, fontStyle: 'bold' },
//         1: { cellWidth: 105 }
//       },
//       margin: { left: 20, right: 20 },
//       tableWidth: 170
//     });
//   }

//   // ========== PROJECT DETAILS SECTION ==========
//   const projectStartY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 110;

//   doc.setFontSize(12);
//   doc.setTextColor(50, 50, 50);
//   doc.setFont(undefined, 'bold');
//   doc.text("PROJECT DETAILS", 20, projectStartY);

//   autoTable(doc, {
//     startY: projectStartY + 8,
//     head: [['Field', 'Information']],
//     body: [
//       // ['Project Name', fullBookingData?.project_name || bookingDetails.projectName],
//       ['Property Type', fullBookingData?.property_type || bookingDetails.propertyType],
//       ['Project Location', fullBookingData?.project_location || bookingDetails.projectLocation],
//       // ['Plot Size', fullBookingData?.plot_size || ''],
//       ['Unit/Plot No.', fullBookingData?.unit_plot_number || ''],
//       ['Area', fullBookingData?.area ? `${fullBookingData.area} sq.ft` : ''],
//     ],
//     theme: 'grid',
//     headStyles: {
//       fillColor: [50, 50, 50],
//       textColor: [255, 255, 255],
//       fontSize: 9,
//       fontStyle: 'bold'
//     },
//     styles: {
//       fontSize: 9,
//       cellPadding: 2
//     },
//     columnStyles: {
//       0: { cellWidth: 45, fontStyle: 'bold' },
//       1: { cellWidth: 105 }
//     },
//     margin: { left: 20, right: 20 },
//     tableWidth: 170
//   });

//   // ========== PAYMENT TRANSACTION DETAILS SECTION ==========
//   const paymentStartY = doc.lastAutoTable.finalY + 10;

//   doc.setFontSize(12);
//   doc.setTextColor(50, 50, 50);
//   doc.setFont(undefined, 'bold');
//   doc.text("PAYMENT TRANSACTION DETAILS", 105, paymentStartY, { align: 'center' });

//   autoTable(doc, {
//     startY: paymentStartY + 8,
//     head: [['Field', 'Details']],
//     body: [
//       ['Transaction ID', paymentData.transactionId || ''],
//       ['Booking ID', bookingDetails.bookingId || ''],
//       ['Payment Method', (paymentData.paymentMethod || 'UPI').toUpperCase()],
//       ['Payment Status', 'SUCCESS'],
//       ['Payment Date', new Date().toLocaleDateString('en-IN')],
//       ['Payment Time', new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })],
//       ['Amount Paid', `₹${Number(paymentData.amountPaid).toLocaleString('en-IN')}`],
//     ],
//     theme: 'grid',
//     headStyles: {
//       fillColor: [34, 139, 34],
//       textColor: [255, 255, 255],
//       fontSize: 9,
//       fontStyle: 'bold'
//     },
//     styles: {
//       fontSize: 9,
//       cellPadding: 2
//     },
//     columnStyles: {
//       0: { cellWidth: 45, fontStyle: 'bold' },
//       1: { cellWidth: 105 }
//     },
//     margin: { left: 20, right: 20 },
//     tableWidth: 170
//   });

//   // ========== IMPORTANT NOTES SECTION ==========
//   const notesY = doc.lastAutoTable.finalY + 15;

//   doc.setFillColor(255, 248, 248);
//   doc.roundedRect(20, notesY, 170, 50, 3, 3, 'F');
//   doc.setDrawColor(219, 7, 29, 0.3);
//   doc.setLineWidth(0.3);
//   doc.roundedRect(20, notesY, 170, 50, 3, 3, 'S');

//   doc.setFontSize(11);
//   doc.setTextColor(219, 7, 29);
//   doc.setFont(undefined, 'bold');
//   doc.text("IMPORTANT NOTES:", 25, notesY + 8);

//   doc.setFontSize(8);
//   doc.setTextColor(100, 100, 100);
//   doc.setFont(undefined, 'normal');

//   const notes = [
//     "1. This is an official payment receipt from Real Estates Opportunity.",
//     "2. The payment is non-refundable except as per company policy.",
//     "3. Booking is subject to availability and final approval.",
//     "4. Our team will contact you within 24 hours.",
//     "5. For any queries, contact: support@realestatesopportunity.com",
//     "6. Plot switching options are available as per terms and conditions.",
//     "7. Keep this receipt for future reference and verification.",
//     "8. All disputes are subject to Kolkata jurisdiction.",
//   ];

//   notes.forEach((note, index) => {
//     doc.text(note, 25, notesY + 15 + (index * 4));
//   });

//   // ========== FOOTER SECTION ==========
//   const footerY = 270;

//   // Decorative line
//   doc.setDrawColor(200, 200, 200);
//   doc.setLineWidth(0.2);
//   doc.line(20, footerY, 190, footerY);

//   // Thank you message
//   doc.setFontSize(9);
//   doc.setTextColor(150, 150, 150);
//   doc.text("Thank you for choosing Real Estates Opportunity", 105, footerY + 5, { align: 'center' });

//   // Signature areas
//   doc.setFontSize(8);
//   doc.setTextColor(100, 100, 100);

//   // Left signature box
//   doc.setDrawColor(200, 200, 200);
//   doc.setLineWidth(0.3);
//   doc.line(40, footerY + 12, 80, footerY + 12);
//   doc.text("Authorized Signature", 60, footerY + 10, { align: 'center' });

//   // Right signature box
//   doc.line(130, footerY + 12, 170, footerY + 12);
//   doc.text("Customer Signature", 150, footerY + 10, { align: 'center' });

//   // Generated info
//   doc.setFontSize(7);
//   doc.setTextColor(150, 150, 150);
//   doc.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, 105, footerY + 20, { align: 'center' });
//   doc.text("© " + new Date().getFullYear() + " Real Estates Opportunity. All rights reserved.", 105, footerY + 25, { align: 'center' });

//   // Page number
//   doc.text("Page 1 of 1", 195, 290, { align: 'right' });

//   // Save PDF
//   const fileName = `REO_Payment_Receipt_${paymentData.transactionId}.pdf`;
//   doc.save(fileName);

//   return fileName;
// };

export default function PaymentClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  const [showReceipt, setShowReceipt] = useState(false);

  const [bookingDetails, setBookingDetails] = useState({
    bookingId: bookingId || "BK" + Math.floor(Math.random() * 10000),
    propertyType: "",
    projectName: "",
    totalAmount: "",
    advanceAmount: "",
    fullBookingData: null,
  });

  const [paymentForm, setPaymentForm] = useState({
    amountPaid: "",
    transactionId: "",
    paymentMethod: "upi",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [popup, setPopup] = useState(null);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);

  const generatePDF = async () => {
    const element = document.getElementById("receipt");
    if (!element) return;

    const html2pdf = (await import("html2pdf.js")).default;
    const filename = `REO_Payment_Receipt_${paymentForm.transactionId}.pdf`;

    html2pdf()
      .set({
        margin: [10, 10, 10, 10],
        filename: filename,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(element)
      .save();
  };

  useEffect(() => {
    if (showReceipt && bookingDetails.fullBookingData) {
      generatePDF();
    }
  }, [showReceipt, bookingDetails.fullBookingData]);

  // Fetch booking details on component mount
  // useEffect(() => {
  //   const fetchBookingDetails = async () => {
  //     if (bookingId) {
  //       try {
  //         const { data, error } = await supabaseBrowser
  //           .from("bookings")
  //           .select("*")
  //           .eq("id", bookingId)
  //           .single();

  //         if (!error && data) {
  //           setBookingDetails((prev) => ({
  //             ...prev,
  //             propertyType: data.property_type || "",
  //             projectName: data.project_name || "",
  //             totalAmount: data.total_property_value || "",
  //             advanceAmount: data.token_advance || "",
  //             fullBookingData: data,
  //           }));

  //           // Pre-fill amount with advance amount if available
  //           if (data.token_advance) {
  //             setPaymentForm((prev) => ({
  //               ...prev,
  //               amountPaid: data.token_advance,
  //             }));
  //           }
  //         }
  //       } catch (error) {
  //         console.error("Error fetching booking details:", error);
  //       }
  //     }
  //   };

  //   fetchBookingDetails();
  // }, [bookingId]);
  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingId) return;

      try {
        const res = await fetch(`/api/bookings/${bookingId}`);
        const data = await res.json();

        if (!res.ok) {
          console.error(data.error);
          return;
        }

        setBookingDetails({
          bookingId: data._id,
          propertyType: data.property?.propertyType || "",
          projectName: data.property?.projectName || "",
          totalAmount: data.payment?.totalPropertyValue || "",
          advanceAmount: data.payment?.tokenAdvance || "",
          fullBookingData: data,
        });

        if (data.payment?.tokenAdvance) {
          setPaymentForm((prev) => ({
            ...prev,
            amountPaid: data.payment.tokenAdvance,
          }));
        }
      } catch (err) {
        console.error("Error fetching booking:", err);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentForm({ ...paymentForm, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bookingId) {
      alert("Invalid booking. Please start again.");
      return;
    }

    if (!paymentForm.amountPaid || !paymentForm.transactionId) {
      alert("Please enter amount paid and transaction ID.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amountPaid: Number(paymentForm.amountPaid),
          transactionId: paymentForm.transactionId,
          paymentMethod: paymentForm.paymentMethod,
          paymentStatus: "success",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Payment update failed");
      }

      // Update local state with latest booking
      setBookingDetails((prev) => ({
        ...prev,
        fullBookingData: data,
      }));

      // Trigger receipt
      setShowReceipt(true);

      setPopup({
        type: "success",
        message:
          `✅ Payment Successful!\n\n` +
          `📋 Receipt Downloaded\n` +
          `💰 Amount: ₹${Number(paymentForm.amountPaid).toLocaleString("en-IN")}\n` +
          `🔢 Transaction ID: ${paymentForm.transactionId}\n` +
          `📞 Booking ID: ${bookingId}\n\n` +
          `Our team will contact you within 24 hours.\n` +
          `Keep the receipt for future reference.`,
      });

      setIsPaymentSuccess(true);
    } catch (error) {
      console.error("Payment error:", error);
      setPopup({
        type: "error",
        message:
          "Payment update failed. Please contact support.\nError: " +
          error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with Booking Info */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 bg-white rounded-xl shadow-lg p-6"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            COMPLETE YOUR BOOKING
          </h1>
        </motion.div>

        {/* Main Payment Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 flex flex-col md:flex-row w-full max-w-5xl rounded-2xl shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)] overflow-hidden bg-white/10 backdrop-blur-xl border border-[#db071d]"
        >
          {/* LEFT SIDE - QR Code */}
          <div className="md:w-1/2 flex flex-col items-center justify-center bg-gradient-to-b from-[#db071d] to-[#db071f] p-6 md:p-8 text-white">
            <h3 className="text-xl font-semibold mb-4">Scan & Pay</h3>

            {/* QR Code Container */}
            <div className="bg-white p-4 rounded-2xl shadow-xl mb-4">
              <div className="relative">
                <Image
                  src="/qr.jpg"
                  alt="Payment QR Code"
                  width={200}
                  height={200}
                  className="rounded-lg"
                />
              </div>
            </div>

            {/* Payment Instructions */}
            <div className="text-center space-y-2 max-w-md">
              <p className="text-sm text-white">
                <span className="font-semibold">Instructions:</span> Scan QR
                code using any UPI app
              </p>
            </div>

            <p className="text-xs text-white mt-4 text-center">
              Once payment is completed, fill the form on the right side.
            </p>
          </div>

          {/* RIGHT SIDE - Payment Form */}
          <div className="md:w-1/2 bg-white text-gray-800 flex flex-col justify-start rounded-r-xl overflow-hidden">
            <div className="p-6 md:p-8">
              {/* Logo */}
              {/* <div className="flex justify-center mb-6">
                <div className="text-center">
                  <Image
                    src="/logo.jpg"
                    alt="REO Logo"
                    width={120}
                    height={120}
                    className="mx-auto"
                  />
                  <p className="text-sm text-gray-600">
                    REAL ESTATES OPPORTUNITY
                  </p>
                </div>
              </div> */}

              <h3 className="text-2xl font-bold text-center text-[#db071d] mb-2">
                Payment Details
              </h3>
              <p className="text-center text-gray-600 mb-6">
                Enter your payment information after completing the transaction
              </p>

              {isPaymentSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-10 h-10 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h4 className="text-2xl font-bold text-green-600 mb-2">
                    Payment Successful!
                  </h4>
                  <p className="text-gray-600 mb-6">
                    Thank you for your payment. Our team will contact you
                    shortly.
                  </p>
                  <button
                    onClick={() => router.push("/")}
                    className="px-6 py-3 bg-[#db071d] text-white font-semibold rounded-lg hover:bg-[#b8061a] transition"
                  >
                    Return to Home
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount Paid (₹) *
                      </label>
                      <input
                        type="number"
                        name="amountPaid"
                        value={paymentForm.amountPaid}
                        onChange={handleInputChange}
                        placeholder="Enter amount paid"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#db071d] focus:border-[#db071d] transition"
                        required
                      />
                      {bookingDetails.advanceAmount && (
                        <p className="text-xs text-gray-500 mt-1">
                          Suggested: ₹{bookingDetails.advanceAmount}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Transaction ID / UTR Number *
                      </label>
                      <input
                        type="text"
                        name="transactionId"
                        value={paymentForm.transactionId}
                        onChange={handleInputChange}
                        placeholder="Enter transaction ID"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#db071d] focus:border-[#db071d] transition"
                        required
                      />
                    </div>
                  </div>

                  {/* Booking Info Display */}
                  {/* {bookingDetails.fullBookingData && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <h4 className="font-semibold text-blue-800 mb-2">
                        Booking Summary
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-600">Customer:</span>
                          <span className="ml-2 font-medium">
                            {bookingDetails.fullBookingData.full_name}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Total Value:</span>
                          <span className="ml-2 font-medium">
                            ₹
                            {Number(
                              bookingDetails.fullBookingData
                                .total_property_value || 0,
                            ).toLocaleString("en-IN")}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Advance Paid:</span>
                          <span className="ml-2 font-medium">
                            ₹
                            {Number(
                              bookingDetails.fullBookingData.token_advance || 0,
                            ).toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    </div>
                  )} */}
                  {bookingDetails.fullBookingData && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <h4 className="font-semibold text-blue-800 mb-2">
                        Booking Summary
                      </h4>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-600">Customer:</span>
                          <span className="ml-2 font-medium">
                            {bookingDetails.fullBookingData.customer?.fullName}
                          </span>
                        </div>

                        <div>
                          <span className="text-gray-600">Total Value:</span>
                          <span className="ml-2 font-medium">
                            ₹
                            {Number(
                              bookingDetails.fullBookingData.payment
                                ?.totalPropertyValue || 0,
                            ).toLocaleString("en-IN")}
                          </span>
                        </div>

                        <div>
                          <span className="text-gray-600">Advance Paid:</span>
                          <span className="ml-2 font-medium">
                            ₹
                            {Number(
                              bookingDetails.fullBookingData.payment
                                ?.tokenAdvance || 0,
                            ).toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-2">
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full py-3.5 bg-[#db071d] hover:bg-[#b8061a] cursor-pointer text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition text-lg ${
                        isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        "Submit Payment Details"
                      )}
                    </motion.button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* POPUP */}
      <AnimatePresence>
        {popup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/60"
          >
            <div
              className={`px-6 py-5 sm:px-8 sm:py-6 rounded-2xl text-center shadow-lg max-w-sm sm:max-w-md w-[90%] ${
                popup.type === "success" ? "bg-green-600" : "bg-red-600"
              } text-white`}
            >
              <p className="whitespace-pre-line text-center leading-relaxed text-white mb-4">
                {popup.message}
              </p>

              <button
                onClick={() => setPopup(null)}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition text-sm sm:text-base"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Hidden receipt for PDF generation */}
      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        {showReceipt && bookingDetails.fullBookingData && (
          <MoneyReceiptTemplate
            data={{
              // Customer
              name: bookingDetails.fullBookingData.customer?.fullName,

              // Payment
              amount: paymentForm.amountPaid,

              amountWords: toWords(
                Number(paymentForm.amountPaid) || 0,
              ).toUpperCase(),

              transactionId:
                bookingDetails.fullBookingData.payment?.transactionId,

              paymentMode:
                bookingDetails.fullBookingData.payment?.paymentMethod?.toUpperCase(),

              paymentDate: new Date().toLocaleDateString("en-IN"),

              receiptNo: paymentForm.transactionId,

              date: new Date().toLocaleDateString("en-IN"),

              // Property
              projectName: bookingDetails.fullBookingData.property?.projectName,

              propertyType:
                bookingDetails.fullBookingData.property?.propertyType,

              location:
                bookingDetails.fullBookingData.property?.projectLocation,

              area: bookingDetails.fullBookingData.property?.area,

              plotNo: bookingDetails.fullBookingData.property?.plotNo,

              plotSize: bookingDetails.fullBookingData.property?.plotSize,

              block: bookingDetails.fullBookingData.property?.block,

              facing: bookingDetails.fullBookingData.property?.facing,
            }}
          />
        )}
      </div>
    </div>
  );
}
