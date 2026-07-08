import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    customer: {
      fullName: { type: String, required: true },
      fatherHusbandName: String,
      mobileNumber: { type: String, required: true },
      email: { type: String, required: true },
      pan: String,
      aadhar: { type: String, required: true },
      address: String,
      city: String,
      state: String,
    },

    nominee: {
      fullName: { type: String, required: true },
      relationship: { type: String, required: true },
      dob: { type: Date, required: true },
      mobileNumber: { type: String, required: true },
      idProofType: { type: String, required: true },
    },

    property: {
      propertyType: String,
      projectName: String,
      projectLocation: String,
      plotSize: String,
      unitPlotNumber: String,
      plotNo: String,
      area: Number,
      block: String,
      facing: String,
    },

    payment: {
      paymentOption: String,
      emiTenure: String,
      totalPropertyValue: Number,
      tokenAdvance: Number,
      remainingBalance: Number,
      ratePerSqFt: Number,
      bookingAmountPaid: Number,
      transactionId: String,
      paymentMethod: String,
      paymentStatus: { type: String, default: "pending" },
    },

    termsAccepted: Boolean,
  },
  { timestamps: true }
);

export default mongoose.models.Booking ||
  mongoose.model("Booking", BookingSchema);