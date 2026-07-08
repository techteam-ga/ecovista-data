"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [bookings, setBookings] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const res = await fetch("/api/bookings");
    const data = await res.json();
    setBookings(data);
    setLoading(false);
  };

  const updateStatus = async (id, status) => {
    alert(`Mark booking as ${status}?`);
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amountPaid: null,
        transactionId: null,
        paymentMethod: null,
        paymentStatus: status,
      }),
    });

    fetchBookings();
  };

  const deleteBooking = async (id) => {
    if (!confirm("Delete this booking?")) return;

    await fetch(`/api/bookings/${id}`, {
      method: "DELETE",
    });

    fetchBookings();
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8 text-gray-900">
      <h1 className="text-3xl font-bold mb-8 text-[#db071d]">
        Admin – Complete Booking Records
      </h1>

      {bookings.map((b) => (
        <div key={b._id} className="bg-white rounded-xl shadow mb-6 border">
          {/* HEADER ROW */}
          <div
            className="p-4 flex justify-between items-center cursor-pointer bg-gray-50"
            onClick={() => setExpandedId(expandedId === b._id ? null : b._id)}
          >
            <div>
              <p className="font-semibold text-lg">{b.customer?.fullName}</p>
              <p className="text-sm text-gray-600">
                {b.customer?.mobileNumber} | {b.customer?.email}
              </p>
            </div>

            <div className="text-right">
              <p className="font-semibold">₹{b.payment?.totalPropertyValue}</p>
              <p className="text-sm capitalize">
                Status:{" "}
                <span className="font-semibold">
                  {b.payment?.paymentStatus || "pending"}
                </span>
              </p>
            </div>
          </div>

          {/* EXPANDED SECTION */}
          {expandedId === b._id && (
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              {/* CUSTOMER */}
              <div>
                <h3 className="font-bold mb-2 text-[#db071d]">
                  Customer Details
                </h3>
                <p>Father/Husband: {b.customer?.fatherHusbandName}</p>
                <p>PAN: {b.customer?.pan}</p>
                <p>Aadhar: {b.customer?.aadhar}</p>
                <p>Address: {b.customer?.address}</p>
                <p>City: {b.customer?.city}</p>
                <p>State: {b.customer?.state}</p>
              </div>

              {/* NOMINEE */}
              <div>
                <h3 className="font-bold mb-2 text-[#db071d]">
                  Nominee Details
                </h3>
                <p>Name: {b.nominee?.fullName}</p>
                <p>Relationship: {b.nominee?.relationship}</p>
                <p>DOB: {new Date(b.nominee?.dob).toLocaleDateString()}</p>
                <p>Mobile: {b.nominee?.mobileNumber}</p>
                <p>ID Proof: {b.nominee?.idProofType}</p>
              </div>

              {/* PROPERTY + PAYMENT */}
              <div>
                <h3 className="font-bold mb-2 text-[#db071d]">
                  Property & Payment
                </h3>

                <p>Project: {b.property?.projectName}</p>
                <p>Location: {b.property?.projectLocation}</p>
                <p>Type: {b.property?.propertyType}</p>
                <p>Plot No: {b.property?.plotNo}</p>
                <p>Area: {b.property?.area}</p>
                <p>Block: {b.property?.block}</p>
                <p>Facing: {b.property?.facing}</p>

                <hr className="my-2" />

                <p>Payment Option: {b.payment?.paymentOption}</p>
                <p>EMI Tenure: {b.payment?.emiTenure}</p>
                <p>Advance: ₹{b.payment?.tokenAdvance}</p>
                <p>Remaining: ₹{b.payment?.remainingBalance}</p>
                <p>Amount Paid: ₹{b.payment?.bookingAmountPaid}</p>
                <p>Transaction: {b.payment?.transactionId}</p>
              </div>

              {/* ACTIONS */}
              <div className="md:col-span-3 flex gap-4 pt-4">
                <button
                  onClick={() => updateStatus(b._id, "success")}
                  className="px-4 py-2 bg-green-600 text-white rounded cursor-pointer"
                >
                  Verify Payment
                </button>

                <button
                  onClick={() => updateStatus(b._id, "failure")}
                  className="px-4 py-2 bg-yellow-500 text-white rounded cursor-pointer"
                >
                  Mark Failed
                </button>

                <button
                  onClick={() => deleteBooking(b._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded cursor-pointer"
                >
                  Delete Booking
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
