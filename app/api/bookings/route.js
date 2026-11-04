import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { hasAdminSession } from "@/lib/admin-auth";

function validPaymentReference(method, rawValue) {
  const value = String(rawValue ?? "").trim();
  switch (method) {
    case "Cash": return /^[A-Z0-9][A-Z0-9/-]{0,29}$/i.test(value);
    case "Cheque": return /^\d{6}$/.test(value);
    case "NEFT/RTGS": return /^[A-Z0-9]{12,22}$/i.test(value);
    case "UPI": return /^\d{12,35}$/.test(value);
    case "Other": return /^[\p{L}\p{M}\d][\p{L}\p{M}\d ./_-]{2,99}$/u.test(value);
    default: return false;
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    if (!body.payment || !validPaymentReference(body.payment.paymentMethod, body.payment.transactionId)) {
      return NextResponse.json({ error: "Enter a valid transaction/reference number for the selected payment method." }, { status: 400 });
    }

    body.payment = { ...body.payment, paymentStatus: "pending verification" };
    const booking = new Booking(body);
    const requestedBookingNo = typeof body.bookingNo === "string" && /^EVB-[A-F0-9]{8}$/.test(body.bookingNo)
      ? body.bookingNo
      : `EVB-${booking._id.toString().slice(-8).toUpperCase()}`;
    const reference = requestedBookingNo.slice(-8);
    booking.bookingNo = requestedBookingNo;
    booking.receiptNo = `BKR-${reference}`;
    await connectDB();
    await booking.save();

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json({ error: "This booking form number was already used. A new number has been generated; please submit again." }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: error.name === "ValidationError" || error instanceof SyntaxError ? 400 : 500 });
  }
}

export async function GET(request) {
  if (!hasAdminSession(request)) {
    return NextResponse.json({ error: "Admin sign-in required." }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }

  try {
    await connectDB();
    const bookings = await Booking.find().sort({ createdAt: -1 });

    return NextResponse.json(bookings, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
