"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

export default function BookingForm() {
  // Customer details state
  // Add this state variable
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
    fullName: "",
    fatherHusbandName: "",
    mobileNumber: "",
    email: "",
    pan: "",
    aadhar: "",
    address: "",
    city: "",
    state: "",
  });

  // Property details state
  const [propertyDetails, setPropertyDetails] = useState({
    propertyType: "Plot",
    projectLocation: "",
    projectName: "Eco Vista Township",
    unitPlotNumber: "",
    area: "",
    plotSize: "",
    ratePerSqFt: "",
    plotNo: "",
    block: "",
    facing: "",
  });

  // Payment details state
  const [paymentDetails, setPaymentDetails] = useState({
    paymentOption: "one-time",
    emiTenure: "12",
    tokenAdvance: "",
    totalPropertyValue: "",
    paymentMode: "UPI",
    transactionNumber: "",
    bookingAmountPaid: "",
  });

  // Project options for dropdown
  // const projectOptions = [
  //   { value: "MEGA CITY KOLKATA", label: "MEGA CITY KOLKATA" },
  //   { value: "GREEN VALLEY RESIDENCY", label: "GREEN VALLEY RESIDENCY" },
  //   { value: "ROYAL GARDENS", label: "ROYAL GARDENS" },
  //   { value: "SKYLINE TOWERS", label: "SKYLINE TOWERS" },
  //   { value: "PEACEFUL MEADOWS", label: "PEACEFUL MEADOWS" },
  //   { value: "GOLDEN PALMS", label: "GOLDEN PALMS" },
  //   { value: "SILVER SPRINGS", label: "SILVER SPRINGS" },
  //   { value: "EMERALD HILLS", label: "EMERALD HILLS" },
  //   { value: "SAPHIRE COURT", label: "SAPHIRE COURT" },
  //   { value: "DIAMOND VILLAS", label: "DIAMOND VILLAS" },
  // ];
  // Nominee details state
  const [nomineeDetails, setNomineeDetails] = useState({
    fullName: "",
    relationship: "",
    dob: "",
    mobileNumber: "",
    idProofType: "",
  });

  const handleFinalSubmit = async () => {
    if (!termsAccepted) return;

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: customerDetails,
          nominee: nomineeDetails,
          property: {
            ...propertyDetails,
            projectName: "Eco Vista Township",
            area: Number(propertyDetails.area),
          },
          payment: {
            paymentOption: paymentDetails.paymentOption,
            emiTenure: paymentDetails.emiTenure,
            totalPropertyValue: Number(paymentDetails.totalPropertyValue),
            tokenAdvance: Number(paymentDetails.tokenAdvance),
            remainingBalance: Number(calculateRemainingBalance()),
            ratePerSqFt: Number(paymentDetails.ratePerSqFt),
            bookingAmountPaid: Number(paymentDetails.bookingAmountPaid),
          },
          termsAccepted: true,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Booking failed");
        return;
      }

      // IMPORTANT: Mongo returns _id not id
      // eslint-disable-next-line react-hooks/immutability
      window.location.href = `/payment?bookingId=${data._id}`;
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  // Calculate remaining balance
  const calculateRemainingBalance = () => {
    const total = parseFloat(paymentDetails.totalPropertyValue) || 0;
    const advance = parseFloat(paymentDetails.tokenAdvance) || 0;
    return (total - advance).toFixed(2);
  };

  // Handle input changes
  const handleInputChange = (section, field, value) => {
    if (section === "customer") {
      setCustomerDetails({
        ...customerDetails,
        [field]: value,
      });
    } else if (section === "property") {
      setPropertyDetails({
        ...propertyDetails,
        [field]: value,
      });
    } else if (section === "payment") {
      setPaymentDetails({
        ...paymentDetails,
        [field]: value,
      });
    } else if (section === "nominee") {
      setNomineeDetails({
        ...nomineeDetails,
        [field]: value,
      });
    }
  };

  // Validation functions
  const validateMobileNumber = (value) => {
    return /^[0-9]{10}$/.test(value);
  };

  const validateEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const validatePAN = (value) => {
    return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value);
  };

  const validateAadhar = (value) => {
    return /^[0-9]{12}$/.test(value);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would handle form submission here
    console.log({
      customerDetails,
      propertyDetails,
      paymentDetails,
      remainingBalance: calculateRemainingBalance(),
    });
    alert("Form submitted successfully! Redirecting to payment...");
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 space-y-2">
          <Image
            src="/logo.jpeg"
            alt="EcoVista Logo"
            width={250}
            height={250}
            className="mx-auto mb-2"
          />

          {/* <h2 className="text-2xl font-semibold text-[#db071d]">
            REAL ESTATES OPPORTUNITY
          </h2> */}

          <h3 className="text-xl font-bold text-gray-700">
            CUSTOMER REGISTRATION FORM
          </h3>

          {/* Kolkata Address */}
          <p className="mt-1 text-sm font-medium text-gray-700 inline-block px-4  rounded">
            📍 101, 1st Floor, Anantham Building, Surendra Singh Compound, Kokar
            Chowk, Kokar, Ranchi - 834001
          </p>
          {/* Bengaluru Address */}
          <p className="mt-1 text-sm font-medium text-gray-700 inline-block px-4  rounded">
            📍 1st Floor, AH45, Krishna Reddy Industrial Estate, Dooravani
            Nagar, Bengaluru, Karnataka – 560016
          </p>

          {/* Kolkata Address */}
          <p className="mt-1 text-sm text-gray-700">
            <span className="font-semibold text-[#db071d]">#</span> RDB
            Boulevard, 8th Floor, EP & GP Complex, Salt Lake, Kolkata – 700 091
          </p>

          {/* Website */}
          {/* <a
            href="https://www.reodevelop.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-3 text-lg font-bold text-[#db071d] underline hover:text-red-700 transition-colors"
          >
            www.reodevelop.com
          </a> */}
        </div>

        {/* Main Form Container - A4 Size Simulation */}
        <div className="bg-white shadow-2xl rounded-lg border border-gray-300 p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Project Details */}
            {/* <div className="border-2 border-gray-800 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center border-b pb-2">
                Project Details
              </h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Project *
                      </label>
                      <div className="relative">
                        <select
                          value={propertyDetails.projectName}
                          onChange={(e) =>
                            handleInputChange(
                              "property",
                              "projectName",
                              e.target.value,
                            )
                          }
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white appearance-none cursor-pointer"
                        >
                          <option value="">Select a project...</option>
                          {projectOptions.map((project) => (
                            <option key={project.value} value={project.value}>
                              {project.label}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <svg
                            className="fill-current h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Property Type *
                        </label>
                        <select
                          value={propertyDetails.propertyType}
                          onChange={(e) =>
                            handleInputChange(
                              "property",
                              "propertyType",
                              e.target.value,
                            )
                          }
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white"
                        >
                          <option value="Plot">Plot</option>
                          <option value="Flat">Flat</option>
                          <option value="Duplex">Duplex</option>
                          <option value="Villa">Villa</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Plot Size *
                        </label>
                        <input
                          type="text"
                          value={propertyDetails.plotSize}
                          onChange={(e) =>
                            handleInputChange(
                              "property",
                              "plotSize",
                              e.target.value,
                            )
                          }
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder:text-gray-400"
                          placeholder="Enter plot size"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location *
                      </label>
                      <input
                        type="text"
                        value={propertyDetails.projectLocation}
                        onChange={(e) =>
                          handleInputChange(
                            "property",
                            "projectLocation",
                            e.target.value,
                          )
                        }
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder:text-gray-400"
                        placeholder="Enter project location"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div> */}

            {/* Customer Details */}
            <div className="border-2 border-gray-800 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center border-b pb-2">
                Customer Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={customerDetails.fullName}
                      onChange={(e) =>
                        handleInputChange(
                          "customer",
                          "fullName",
                          e.target.value,
                        )
                      }
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder:text-gray-400"
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Father / Husband Name
                    </label>
                    <input
                      type="text"
                      value={customerDetails.fatherHusbandName}
                      onChange={(e) =>
                        handleInputChange(
                          "customer",
                          "fatherHusbandName",
                          e.target.value,
                        )
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder:text-gray-400"
                      placeholder="Enter father/husband name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mobile Number *
                      {customerDetails.mobileNumber &&
                        !validateMobileNumber(customerDetails.mobileNumber) && (
                          <span className="text-red-500 text-xs ml-2">
                            Must be 10 digits
                          </span>
                        )}
                    </label>
                    <input
                      type="tel"
                      value={customerDetails.mobileNumber}
                      onChange={(e) =>
                        handleInputChange(
                          "customer",
                          "mobileNumber",
                          e.target.value,
                        )
                      }
                      required
                      className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder:text-gray-400 ${
                        customerDetails.mobileNumber &&
                        !validateMobileNumber(customerDetails.mobileNumber)
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter 10-digit mobile number"
                      maxLength="10"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email ID *
                      {customerDetails.email &&
                        !validateEmail(customerDetails.email) && (
                          <span className="text-red-500 text-xs ml-2">
                            Invalid email
                          </span>
                        )}
                    </label>
                    <input
                      type="email"
                      value={customerDetails.email}
                      onChange={(e) =>
                        handleInputChange("customer", "email", e.target.value)
                      }
                      required
                      className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder:text-gray-400 ${
                        customerDetails.email &&
                        !validateEmail(customerDetails.email)
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter email address"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      PAN Number
                      {customerDetails.pan &&
                        !validatePAN(customerDetails.pan) && (
                          <span className="text-red-500 text-xs ml-2">
                            Invalid PAN format
                          </span>
                        )}
                    </label>
                    <input
                      type="text"
                      value={customerDetails.pan}
                      onChange={(e) =>
                        handleInputChange(
                          "customer",
                          "pan",
                          e.target.value.toUpperCase(),
                        )
                      }
                      className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder:text-gray-400 ${
                        customerDetails.pan && !validatePAN(customerDetails.pan)
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter PAN (e.g., ABCDE1234F)"
                      maxLength="10"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Aadhar Card Number *
                      {customerDetails.aadhar &&
                        !validateAadhar(customerDetails.aadhar) && (
                          <span className="text-red-500 text-xs ml-2">
                            Must be 12 digits
                          </span>
                        )}
                    </label>
                    <input
                      type="text"
                      value={customerDetails.aadhar}
                      onChange={(e) =>
                        handleInputChange(
                          "customer",
                          "aadhar",
                          e.target.value.replace(/\D/g, ""),
                        )
                      }
                      required
                      className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder:text-gray-400 ${
                        customerDetails.aadhar &&
                        !validateAadhar(customerDetails.aadhar)
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter 12-digit Aadhar number"
                      maxLength="12"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address *
                    </label>
                    <textarea
                      value={customerDetails.address}
                      onChange={(e) =>
                        handleInputChange("customer", "address", e.target.value)
                      }
                      required
                      className="w-full px-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder:text-gray-400"
                      rows="2"
                      placeholder="Enter street address"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 ">
                        City *
                      </label>
                      <input
                        type="text"
                        value={customerDetails.city}
                        onChange={(e) =>
                          handleInputChange("customer", "city", e.target.value)
                        }
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder:text-gray-400"
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        value={customerDetails.state}
                        onChange={(e) =>
                          handleInputChange("customer", "state", e.target.value)
                        }
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder:text-gray-400"
                        placeholder="State"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Nominee Details */}
            <div className="border-2 border-gray-800 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center border-b pb-2">
                Nominee Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nominee Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nominee Full Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={nomineeDetails.fullName}
                    onChange={(e) =>
                      handleInputChange("nominee", "fullName", e.target.value)
                    }
                    required
                    placeholder="Enter nominee full name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                   text-gray-800 placeholder:text-gray-400"
                  />
                </div>

                {/* Relationship */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Relationship with Applicant{" "}
                    <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={nomineeDetails.relationship}
                    onChange={(e) =>
                      handleInputChange(
                        "nominee",
                        "relationship",
                        e.target.value,
                      )
                    }
                    required
                    placeholder="Spouse / Son / Daughter / Father / Mother / Other"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                   text-gray-800 placeholder:text-gray-400"
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nominee Date of Birth{" "}
                    <span className="text-gray-500 text-xs">
                      (DD / MM / YYYY)
                    </span>{" "}
                    <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="date"
                    value={nomineeDetails.dob}
                    onChange={(e) =>
                      handleInputChange("nominee", "dob", e.target.value)
                    }
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                   text-gray-800"
                  />
                </div>

                {/* Nominee Mobile Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nominee Mobile Number{" "}
                    <span className="text-red-600">*</span>
                    {nomineeDetails.mobileNumber &&
                      !validateMobileNumber(nomineeDetails.mobileNumber) && (
                        <span className="text-red-500 text-xs ml-2">
                          Must be 10 digits
                        </span>
                      )}
                  </label>
                  <input
                    type="tel"
                    value={nomineeDetails.mobileNumber}
                    onChange={(e) =>
                      handleInputChange(
                        "nominee",
                        "mobileNumber",
                        e.target.value,
                      )
                    }
                    required
                    maxLength="10"
                    placeholder="Enter 10-digit mobile number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                   text-gray-800 placeholder:text-gray-400"
                  />
                </div>

                {/* ID Proof */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nominee ID Proof Type{" "}
                    <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={nomineeDetails.idProofType}
                    onChange={(e) =>
                      handleInputChange(
                        "nominee",
                        "idProofType",
                        e.target.value,
                      )
                    }
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                   text-gray-800 bg-white"
                  >
                    <option value="" disabled>
                      Select ID Proof
                    </option>
                    <option value="Aadhar">Aadhar Card</option>
                    <option value="PAN">PAN Card</option>
                    <option value="Voter ID">Voter ID</option>
                    <option value="Passport">Passport</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Property Selection */}
            {/* <div className="border-2 border-gray-800 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center border-b pb-2">
                Property Selection
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unit / Plot Number *
                    </label>
                    <input
                      type="text"
                      value={propertyDetails.unitPlotNumber}
                      onChange={(e) =>
                        handleInputChange(
                          "property",
                          "unitPlotNumber",
                          e.target.value
                        )
                      }
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder:text-gray-400"
                      placeholder="Enter unit/plot number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Area (sq.ft / sq.yd) *
                    </label>
                    <input
                      type="number"
                      value={propertyDetails.area}
                      onChange={(e) =>
                        handleInputChange("property", "area", e.target.value)
                      }
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder:text-gray-400"
                      placeholder="Enter area"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Plot No. *
                    </label>
                    <input
                      type="text"
                      value={propertyDetails.plotNo}
                      onChange={(e) =>
                        handleInputChange("property", "plotNo", e.target.value)
                      }
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder:text-gray-400"
                      placeholder="Enter plot number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rate per SQ.FT. *
                    </label>
                    <input
                      type="number"
                      value={paymentDetails.ratePerSqFt}
                      onChange={(e) =>
                        handleInputChange(
                          "payment",
                          "ratePerSqFt",
                          e.target.value
                        )
                      }
                      required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-[#db071d] text-gray-800 placeholder:text-gray-400"
                      placeholder="Enter rate per sq.ft"
                    />
                  </div>
                </div>
              </div>
            </div> */}

            {/* Property Details */}
            <div className="border-2 border-gray-800 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center border-b pb-2">
                Property Details
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full border-2 border-gray-800 border-collapse text-sm text-gray-800">
                  <tbody>
                    {/* Row 1 */}
                    <tr>
                      <td className="border border-gray-800 bg-gray-100 px-3 py-3 font-semibold w-40">
                        Project
                      </td>

                      <td className="border border-gray-800 px-3 py-2 bg-white text-gray-800">
                        <input
                          type="text"
                          value="Eco Vista Township"
                          readOnly
                          className="w-full bg-gray-100 text-gray-800 font-medium outline-none cursor-not-allowed"
                        />
                      </td>

                      <td className="border border-gray-800 bg-gray-100 px-3 py-3 font-semibold w-32">
                        Block
                      </td>

                      <td className="border border-gray-800 px-3 py-2 bg-white text-gray-800">
                        <input
                          type="text"
                          value={propertyDetails.block}
                          onChange={(e) =>
                            handleInputChange(
                              "property",
                              "block",
                              e.target.value,
                            )
                          }
                          className="w-full bg-transparent outline-none text-gray-800"
                          placeholder="Block"
                        />
                      </td>
                    </tr>

                    {/* Row 2 */}
                    <tr>
                      <td className="border border-gray-800 bg-gray-100 px-3 py-3 font-semibold text-gray-800 align-middle">
                        Plot No.
                      </td>

                      <td className="border border-gray-800 px-3 py-2 bg-white text-gray-800">
                        <input
                          type="text"
                          value={propertyDetails.plotNo}
                          onChange={(e) =>
                            handleInputChange(
                              "property",
                              "plotNo",
                              e.target.value,
                            )
                          }
                          className="w-full bg-transparent outline-none text-gray-800"
                          placeholder="Plot Number"
                        />
                      </td>

                      <td className="border border-gray-800 bg-gray-100 px-3 py-3 font-semibold text-gray-800 align-middle">
                        Plot Size
                      </td>

                      <td className="border border-gray-800 px-3 py-2 bg-white text-gray-800">
                        <input
                          type="text"
                          value={propertyDetails.plotSize}
                          onChange={(e) =>
                            handleInputChange(
                              "property",
                              "plotSize",
                              e.target.value,
                            )
                          }
                          className="w-full bg-transparent outline-none text-gray-800"
                          placeholder="Sq.ft / Sq.yd"
                        />
                      </td>
                    </tr>

                    {/* Row 3 */}
                    <tr>
                      <td className="border border-gray-800 bg-gray-100 px-3 py-3 font-semibold text-gray-800 align-middle">
                        Facing
                      </td>

                      <td className="border border-gray-800 px-3 py-2 bg-white text-gray-800">
                        <input
                          type="text"
                          value={propertyDetails.facing}
                          onChange={(e) =>
                            handleInputChange(
                              "property",
                              "facing",
                              e.target.value,
                            )
                          }
                          className="w-full bg-transparent outline-none text-gray-800"
                          placeholder="East / West / North"
                        />
                      </td>

                      <td className="border border-gray-800 bg-gray-100 px-3 py-3 font-semibold text-gray-800 align-middle">
                        Category
                      </td>

                      <td className="border border-gray-800 px-3 py-2 bg-white text-gray-800">
                        <div className="flex gap-6">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="propertyType"
                              value="Residential"
                              checked={
                                propertyDetails.propertyType === "Residential"
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  "property",
                                  "propertyType",
                                  e.target.value,
                                )
                              }
                            />
                            Residential
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="propertyType"
                              value="Commercial"
                              checked={
                                propertyDetails.propertyType === "Commercial"
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  "property",
                                  "propertyType",
                                  e.target.value,
                                )
                              }
                            />
                            Commercial
                          </label>
                        </div>
                      </td>
                    </tr>

                    {/* Row 4 */}
                    <tr>
                      <td className="border border-gray-800 bg-gray-100 px-3 py-3 font-semibold text-gray-800 align-middle">
                        Area
                      </td>

                      <td className="border border-gray-800 px-3 py-2 bg-white text-gray-800">
                        <input
                          type="number"
                          value={propertyDetails.area}
                          onChange={(e) =>
                            handleInputChange(
                              "property",
                              "area",
                              e.target.value,
                            )
                          }
                          className="w-full bg-transparent outline-none text-gray-800"
                          placeholder="Area"
                        />
                      </td>

                      <td className="border border-gray-800 bg-gray-100 px-3 py-3 font-semibold text-gray-800 align-middle">
                        Rate / Sq.Ft
                      </td>

                      <td className="border border-gray-800 px-3 py-2 bg-white text-gray-800">
                        <input
                          type="number"
                          value={paymentDetails.ratePerSqFt}
                          onChange={(e) =>
                            handleInputChange(
                              "payment",
                              "ratePerSqFt",
                              e.target.value,
                            )
                          }
                          className="w-full bg-transparent outline-none text-gray-800"
                          placeholder="Rate"
                        />
                      </td>
                    </tr>

                    {/* Row 5 */}
                    <tr>
                      <td className="border border-gray-800 bg-gray-100 px-3 py-3 font-semibold text-gray-800 align-middle">
                        Sale Value
                      </td>

                      <td className="border border-gray-800 px-3 py-2 bg-white text-gray-800">
                        <input
                          type="number"
                          value={paymentDetails.totalPropertyValue}
                          onChange={(e) =>
                            handleInputChange(
                              "payment",
                              "totalPropertyValue",
                              e.target.value,
                            )
                          }
                          className="w-full bg-transparent outline-none text-gray-800"
                        />
                      </td>

                      <td className="border border-gray-800 bg-gray-100 px-3 py-3 font-semibold text-gray-800 align-middle">
                        Booking Amount
                      </td>

                      <td className="border border-gray-800 px-3 py-2 bg-white text-gray-800">
                        <input
                          type="number"
                          value={paymentDetails.bookingAmountPaid}
                          onChange={(e) =>
                            handleInputChange(
                              "payment",
                              "bookingAmountPaid",
                              e.target.value,
                            )
                          }
                          className="w-full bg-transparent outline-none text-gray-800"
                        />
                      </td>
                    </tr>

                    {/* Row 6 */}
                    <tr>
                      <td className="border border-gray-800 bg-gray-100 px-3 py-3 font-semibold text-gray-800 align-middle">
                        Payment Mode
                      </td>

                      <td className="border border-gray-800 px-3 py-2 bg-white text-gray-800">
                        <select
                          value={paymentDetails.paymentMode}
                          onChange={(e) =>
                            handleInputChange(
                              "payment",
                              "paymentMode",
                              e.target.value,
                            )
                          }
                          className="w-full bg-transparent outline-none text-gray-800"
                        >
                          <option>Cash</option>
                          <option>UPI</option>
                          <option>NEFT</option>
                          <option>Cheque</option>
                        </select>
                      </td>

                      <td className="border border-gray-800 bg-gray-100 px-3 py-3 font-semibold text-gray-800 align-middle">
                        EMI Plan
                      </td>

                      <td className="border border-gray-800 px-3 py-2 bg-white text-gray-800">
                        <input
                          readOnly
                          value={
                            paymentDetails.paymentOption === "emi"
                              ? `${paymentDetails.emiTenure} Months`
                              : "One Time Payment"
                          }
                          className="w-full bg-gray-50 outline-none text-gray-800"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payment Details */}
            <div className="border-2 border-gray-800 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center border-b pb-2">
                Payment Details
              </h2>
              {/* Silver Joining Amount */}
              {/* <div className="mb-6 text-center">
                <span className="text-xl font-bold text-[#db071d]">
                  Silver Joining Amount = ₹2,31,300 /-
                </span>
              </div> */}

              {/* Payment Option Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Payment Option
                </label>
                <div className="flex space-x-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentOption"
                      value="one-time"
                      checked={paymentDetails.paymentOption === "one-time"}
                      onChange={(e) =>
                        handleInputChange(
                          "payment",
                          "paymentOption",
                          e.target.value,
                        )
                      }
                      className="w-4 h-4 text-[#db071d]"
                    />
                    <span className="ml-2 text-gray-700">One-Time Payment</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentOption"
                      value="emi"
                      checked={paymentDetails.paymentOption === "emi"}
                      onChange={(e) =>
                        handleInputChange(
                          "payment",
                          "paymentOption",
                          e.target.value,
                        )
                      }
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="ml-2 text-gray-700">EMI Payment</span>
                  </label>
                </div>

                {/* EMI Tenure (only shown if EMI selected) */}
                {paymentDetails.paymentOption === "emi" && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      EMI Tenure
                    </label>
                    <select
                      value={paymentDetails.emiTenure}
                      onChange={(e) =>
                        handleInputChange(
                          "payment",
                          "emiTenure",
                          e.target.value,
                        )
                      }
                      className="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white"
                    >
                      <option value="12">12 months</option>
                      <option value="24">24 months</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Payment Amount Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Paying Amount (₹)
                  </label>

                  <input
                    type="number"
                    value={paymentDetails.tokenAdvance}
                    onChange={(e) =>
                      handleInputChange(
                        "payment",
                        "tokenAdvance",
                        e.target.value,
                      )
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#db071d] focus:border-[#db071d] text-gray-800 placeholder:text-gray-400"
                    placeholder="Enter paying amount"
                  />
                </div>

                <div className="flex items-end">
                  <div className="w-full bg-gray-100 border border-gray-300 rounded-md px-4 py-2">
                    <span className="text-sm font-medium text-gray-700">
                      Paying Amount:
                    </span>
                    <span className="ml-2 text-gray-800 font-semibold">
                      ₹{paymentDetails.tokenAdvance || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="border-2 border-gray-800 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center border-b pb-2">
                Terms & Conditions
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    required
                  />
                  <label htmlFor="terms" className="ml-2 text-gray-700">
                    I certify that all information provided in this application
                    is correct. By submitting this form, I formally accept the
                    terms and conditions associated with the Signature
                  </label>
                </div>
                {/* <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Customer Signature
                    </label>
                    <div className="w-64 border-b-2 border-gray-800 h-8">Input Name </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <div className="w-48 border-b-2 border-gray-800 h-8"></div>
                  </div>
                </div> */}
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="button"
                disabled={!termsAccepted}
                onClick={handleFinalSubmit}
                className={`px-12 py-4 text-white font-bold text-lg rounded-lg transition-all duration-300 shadow-lg ${
                  termsAccepted
                    ? "bg-linear-to-r from-[#db071d] to-[#db071d] hover:shadow-xl cursor-pointer"
                    : "bg-linear-to-r from-gray-400 to-gray-500 cursor-not-allowed opacity-70"
                }`}
              >
                {termsAccepted
                  ? "SUBMIT & PROCEED TO PAYMENT"
                  : "ACCEPT TERMS TO PROCEED"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
