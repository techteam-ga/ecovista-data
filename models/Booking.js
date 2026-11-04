import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  bookingNo: { type: String, unique: true, sparse: true },
  receiptNo: { type: String, unique: true, sparse: true },
  customer: {
    fullName: { type: String, required: true, trim: true },
    fatherHusbandName: String,
    mobileNumber: { type: String, required: true, match: /^\d{10}$/ },
    email: { type: String, trim: true, lowercase: true },
    dateOfBirth: String,
    pan: { type: String, uppercase: true, match: /^[A-Z]{5}\d{4}[A-Z]$|^$/ },
    aadhar: { type: String, match: /^\d{12}$|^$/ },
    address: { type: String, required: true, trim: true },
  },
  nominee: { type: mongoose.Schema.Types.Mixed, default: {} },
  property: {
    propertyType: { type: String, enum: ["Residential Plot", "Simplex Private House (G+1)"] },
    projectName: { type: String, default: "Eco Vista Township" },
    projectLocation: { type: String, default: "Dhanbad" },
    unitPlotNumber: { type: String, required: true, trim: true },
    plotNo: String,
    area: { type: Number, required: true, min: 1 },
    plotSize: String,
    facing: String,
    block: String,
  },
  payment: {
    paymentOption: String,
    paymentPlan: { type: String, required: true },
    emiTenure: String,
    totalPropertyValue: Number,
    tokenAdvance: Number,
    remainingBalance: Number,
    ratePerSqFt: Number,
    bookingAmountPaid: { type: Number, required: true, min: 0.01 },
    amountPaid: { type: Number, required: true, min: 0.01 },
    paymentDate: { type: String, required: true },
    bankBranch: String,
    transactionId: { type: String, required: true, trim: true },
    paymentMethod: { type: String, required: true, enum: ["Cash", "Cheque", "NEFT/RTGS", "UPI", "Other"] },
    paymentStatus: { type: String, default: "pending verification", enum: ["pending", "pending verification", "success", "failure"] },
  },
  termsAccepted: { type: Boolean, required: true, validate: (value) => value === true },
}, { timestamps: true });

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
