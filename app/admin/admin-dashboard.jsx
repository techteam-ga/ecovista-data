"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const humanize = (key) => key.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());

function displayValue(value) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  return String(value);
}

function DataSection({ title, data }) {
  const entries = Object.entries(data || {}).filter(([key]) => !["_id", "__v"].includes(key));
  if (!entries.length) return null;
  return (
    <section className="rounded-xl border border-emerald-900/15 bg-white p-4">
      <h2 className="mb-3 font-bold text-emerald-950">{title}</h2>
      <dl className="grid gap-x-5 gap-y-3 sm:grid-cols-2">
        {entries.map(([key, value]) => (
          <div key={key} className="min-w-0">
            <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{humanize(key)}</dt>
            <dd className="mt-1 break-words text-sm text-gray-900">
              {typeof value === "object" && value !== null ? (
                <pre className="overflow-x-auto whitespace-pre-wrap rounded bg-gray-50 p-2 text-xs">{displayValue(value)}</pre>
              ) : displayValue(value)}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);
  const router = useRouter();

  const fetchBookings = useCallback(async () => {
    setError("");
    try {
      const response = await fetch("/api/bookings", { cache: "no-store" });
      if (response.status === 401) {
        router.replace("/admin/login");
        return;
      }
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load booking records.");
      setBookings(Array.isArray(data) ? data : []);
    } catch (fetchError) {
      setError(fetchError.message || "Could not load booking records.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const timer = window.setTimeout(() => { void fetchBookings(); }, 0);
    return () => window.clearTimeout(timer);
  }, [fetchBookings]);

  const updateStatus = async (id, status) => {
    const prompt = status === "success" ? "Verify this payment?" : "Mark this payment as failed?";
    if (!window.confirm(prompt)) return;
    setBusyId(id);
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: status }),
      });
      const data = await response.json();
      if (response.status === 401) return router.replace("/admin/login");
      if (!response.ok) throw new Error(data.error || "Could not update payment status.");
      await fetchBookings();
    } catch (updateError) {
      setError(updateError.message);
    } finally {
      setBusyId(null);
    }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm("Permanently delete this booking record?")) return;
    setBusyId(id);
    try {
      const response = await fetch(`/api/bookings/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (response.status === 401) return router.replace("/admin/login");
      if (!response.ok) throw new Error(data.error || "Could not delete booking.");
      await fetchBookings();
    } catch (deleteError) {
      setError(deleteError.message);
    } finally {
      setBusyId(null);
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-stone-100 px-4 py-8 text-gray-900 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">Eco Vista Township</p>
            <h1 className="mt-1 text-2xl font-bold text-emerald-950 sm:text-3xl">Booking Records</h1>
            <p className="mt-1 text-sm text-gray-600">{bookings.length} record{bookings.length === 1 ? "" : "s"}</p>
          </div>
          <button onClick={logout} className="rounded-lg border border-emerald-900 px-4 py-2 text-sm font-semibold text-emerald-950 hover:bg-emerald-50">Sign out</button>
        </header>

        {error && <p role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
        {loading ? <p className="rounded-xl bg-white p-6">Loading booking records…</p> : null}
        {!loading && bookings.length === 0 && !error ? <p className="rounded-xl bg-white p-6 text-gray-600">No bookings have been submitted yet.</p> : null}

        <div className="space-y-4">
          {bookings.map((booking) => {
            const id = String(booking._id);
            const expanded = expandedId === id;
            const status = booking.payment?.paymentStatus || "pending verification";
            return (
              <article key={id} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <button type="button" aria-expanded={expanded} onClick={() => setExpandedId(expanded ? null : id)} className="flex w-full flex-wrap items-center justify-between gap-3 bg-white p-4 text-left hover:bg-stone-50 sm:p-5">
                  <span>
                    <span className="block font-bold text-emerald-950">{booking.bookingNo || "Booking"} · {booking.customer?.fullName || "Unnamed customer"}</span>
                    <span className="mt-1 block text-sm text-gray-600">{booking.customer?.mobileNumber || "No phone"} · {booking.customer?.email || "No email"}</span>
                  </span>
                  <span className="text-left sm:text-right">
                    <span className="block font-semibold">₹{booking.payment?.totalPropertyValue ?? booking.payment?.bookingAmountPaid ?? "—"}</span>
                    <span className="block text-sm capitalize text-gray-600">Payment: {status}</span>
                  </span>
                </button>
                {expanded && (
                  <div className="border-t border-gray-200 bg-stone-50 p-4 sm:p-5">
                    <div className="grid gap-4 md:grid-cols-2">
                      <DataSection title="Booking" data={{ bookingNo: booking.bookingNo, receiptNo: booking.receiptNo, createdAt: booking.createdAt, updatedAt: booking.updatedAt, recordId: booking._id }} />
                      <DataSection title="Customer" data={booking.customer} />
                      <DataSection title="Nominee" data={booking.nominee} />
                      <DataSection title="Property" data={booking.property} />
                      <DataSection title="Payment" data={booking.payment} />
                      <DataSection title="Other stored data" data={{ termsAccepted: booking.termsAccepted, ...Object.fromEntries(Object.entries(booking).filter(([key]) => !["_id", "__v", "bookingNo", "receiptNo", "createdAt", "updatedAt", "customer", "nominee", "property", "payment", "termsAccepted"].includes(key))) }} />
                    </div>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <button disabled={busyId === id} onClick={() => updateStatus(id, "success")} className="rounded-lg bg-emerald-800 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Verify payment</button>
                      <button disabled={busyId === id} onClick={() => updateStatus(id, "failure")} className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Mark failed</button>
                      <button disabled={busyId === id} onClick={() => deleteBooking(id)} className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Delete record</button>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
