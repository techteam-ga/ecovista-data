import "./receipt.css";

export default function MoneyReceiptTemplate({ data }) {
  return (
    <div id="receipt" className="receipt-page">
      {/* HEADER */}
      <div className="receipt-header">
        <div className="receipt-logo">
          <img src="/logo.jpeg" alt="Company Logo" />
        </div>
        <div className="receipt-company">
          <div className="receipt-company">
            <p>101, 1st Floor, Anantham Building,</p>

            <p>Surendra Singh Compound, Kokar Chowk,</p>

            <p>Kokar, Ranchi - 834001</p>

            {/* <p>Dooravani Nagar, Bengaluru, Karnataka - 560016</p> */}
          </div>
        </div>
      </div>

      <div className="receipt-title-box">
        <h1>PAYMENT RECEIPT</h1>
      </div>

      {/* META */}
      <div className="receipt-meta">
        <span>
          <b>Date:</b> {data.date}
        </span>
        <span>
          <b>Receipt No:</b> {data.receiptNo}
        </span>
      </div>

      {/* BODY */}
      <p className="receipt-text">
        Received with thanks from <b>{data.name}</b>
      </p>

      <p className="receipt-text">
        a sum of <b>₹ {data.amount}</b> (Rupees {data.amountWords} only) towards
        the booking amount received for the property mentioned below:
      </p>

      {/* DETAILS */}
      <div className="receipt-details-box">
        {/* <div><span>Project Name</span><span>{data.projectName}</span></div> */}
        {/* <div><span>Property Type</span><span>{data.propertyType}</span></div> */}
        {/* <div><span>Location</span><span>{data.location}</span></div> */}
        {/* <div>
          <span>Area</span>
          <span>{data.area}</span>
        </div> */}
        <div>
          <span>Transaction No</span>
          <span>{data.transactionId}</span>
        </div>
        <div>
          <span>Payment Mode</span>
          <span>{data.paymentMode}</span>
        </div>
        <div>
          <span>Payment Date</span>
          <span>{data.paymentDate}</span>
        </div>
      </div>

      <div className="receipt-property-box">
        <h3>Property Details</h3>

        <div className="receipt-property-grid">
          <div>
            <span>Project</span>
            <span>{data.projectName}</span>
          </div>

          <div>
            <span>Booking Plot Size</span>
            <span>{data.plotSize}</span>
          </div>

          <div>
            <span>Plot No.</span>
            <span>{data.plotNo}</span>
          </div>

          <div>
            <span>Block</span>
            <span>{data.block}</span>
          </div>

          <div>
            <span>Facing</span>
            <span>{data.facing}</span>
          </div>

          <div>
            <span>Category</span>
            <span>{data.propertyType}</span>
          </div>
        </div>
      </div>
      {/* NOTE */}
      <div className="receipt-note-box">
        <p>
          This receipt is issued only as an acknowledgment of the Advance
          Booking Amount received. It does not constitute confirmation of plot
          allotment or ownership. Plot booking shall be confirmed only after
          completion of the prescribed booking formalities and issuance of the
          official Plot Allotment Letter by Eco Vista Township. Company Terms &
          Conditions shall apply.
        </p>
      </div>

      {/* FOOTER */}
      <div className="receipt-footer">
        <p className="receipt-disclaimer">
          This is a computer-generated receipt; hence, no signature is required.
        </p>
      </div>
    </div>
  );
}
