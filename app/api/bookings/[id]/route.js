import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { hasAdminSession, isSameOriginRequest } from "@/lib/admin-auth";

function requireAdmin(request) {
  if (!hasAdminSession(request)) {
    return NextResponse.json({ error: "Admin sign-in required." }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }
  return null;
}

function requireSameOrigin(request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Request origin is not allowed." }, { status: 403 });
  }
  return null;
}

export async function GET(req, { params }) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;
  try {
    await connectDB();
    const { id } = await params;
    const booking = await Booking.findById(id);
    if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    return NextResponse.json(booking, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;
  const invalidOrigin = requireSameOrigin(req);
  if (invalidOrigin) return invalidOrigin;
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const updates = {};
    if (body.amountPaid != null) {
      updates["payment.amountPaid"] = Number(body.amountPaid);
      updates["payment.bookingAmountPaid"] = Number(body.amountPaid);
    }
    if (body.transactionId != null) updates["payment.transactionId"] = body.transactionId;
    if (body.paymentMethod != null) updates["payment.paymentMethod"] = body.paymentMethod;
    if (body.paymentStatus != null) updates["payment.paymentStatus"] = body.paymentStatus;
    const updated = await Booking.findByIdAndUpdate(id, { $set: updates }, { returnDocument: "after" });
    if (!updated) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;
  const invalidOrigin = requireSameOrigin(req);
  if (invalidOrigin) return invalidOrigin;
  try {
    await connectDB();
    const { id } = await params;
    const deleted = await Booking.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
