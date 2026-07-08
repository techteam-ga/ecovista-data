import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const booking = await Booking.findById(id);

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(booking);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await req.json();

    const updated = await Booking.findByIdAndUpdate(
      id,
      {
        $set: {
          "payment.bookingAmountPaid": body.amountPaid,
          "payment.transactionId": body.transactionId,
          "payment.paymentMethod": body.paymentMethod,
          "payment.paymentStatus": body.paymentStatus,
        },
      },
      { returnDocument: "after" } // 🔥 FIXED mongoose warning
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  await connectDB();
  const { id } = await params;

  await Booking.findByIdAndDelete(id);

  return NextResponse.json({ message: "Deleted" });
}