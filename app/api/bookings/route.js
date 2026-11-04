import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { hasAdminSession } from "@/lib/admin-auth";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    body.payment = { ...body.payment, paymentStatus: "pending verification" };
    const booking = new Booking(body);
    const reference = booking._id.toString().slice(-8).toUpperCase();
    booking.bookingNo = `EVB-${reference}`;
    booking.receiptNo = `BKR-${reference}`;
    await booking.save();

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
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
