import { forwardRef } from "react";
import Image from "next/image";
import "./receipt.css";

const MoneyReceiptTemplate = forwardRef(function MoneyReceiptTemplate({ data }, ref) {
  const customer = data.customer || {};
  const property = data.property || {};
  const payment = data.payment || {};
  const date = new Date(data.createdAt || Date.now()).toLocaleDateString("en-IN");
  return <div ref={ref} className="receipt-page">
    <div className="receipt-corner receipt-corner-left"/><div className="receipt-corner receipt-corner-right"/>
    <header className="receipt-header">
      <div className="receipt-brand"><Image src="/logo.jpg" alt="Eco Vista Township" width={250} height={84} priority/></div>
      <div className="receipt-heading"><h1>BOOKING AMOUNT <em>RECEIPT</em></h1><p>I N V E S T　 |　 B U I L D　 |　 B E L O N G</p></div>
      <p className="receipt-date"><b>Date:</b> {date}</p>
    </header>
    <div className="receipt-number"><span>Receipt No.</span><b>{data.receiptNo}</b></div>
    <div className="receipt-rows">
      <div><span>Received with Thanks from</span><b>{customer.fullName}</b></div>
      <div><span>Contact No.</span><b>{customer.mobileNumber}</b></div>
      <div><span>Amount (₹)</span><b>₹ {Number(payment.bookingAmountPaid || 0).toLocaleString("en-IN")}</b></div>
      <div><span>Amount in Words</span><b>{data.amountWords || "As stated above"} Rupees Only</b></div>
      <div><span>Payment Mode</span><b>{payment.paymentMethod}</b></div>
      <div><span>Cheque / Transaction No.</span><b>{payment.transactionId}</b><i>Dated: {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString("en-IN") : date}</i></div>
      <div><span>On Account of</span><b>Booking amount – {payment.paymentPlan}</b></div>
      <div><span>Project</span><b>Eco Vista Township, Dhanbad</b></div>
      <div><span>Plot / Unit No.</span><b>{property.unitPlotNumber}</b></div>
      <div><span>Property Type / Area</span><b>{property.propertyType} · {property.area} Sq. Ft.</b></div>
      <div><span>Remarks</span><b>Payment reference submitted for verification</b></div>
    </div>
    <div className="receipt-status"><strong>PAYMENT STATUS: PENDING MANUAL VERIFICATION</strong><span>This receipt acknowledges the details submitted. Payment is confirmed only after verification by Eco Vista Township.</span></div>
    <footer className="receipt-footer"><span>🤝　Thank you for your valuable trust in Eco Vista.</span><small>Computer generated receipt</small></footer>
  </div>;
});

export default MoneyReceiptTemplate;
