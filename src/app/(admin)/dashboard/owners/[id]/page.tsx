import Link from "next/link";
import { 
  BellRing, 
  Ban, 
  Building2, 
  CheckCircle2, 
  Wallet, 
  DollarSign, 
  Phone, 
  Activity, 
  Eye, 
  Download,
  Home
} from "lucide-react";

export default async function OwnerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const ownerName = resolvedParams.id === "david-cohen" ? "David Cohen" : "Owner Profile";

  const ownerApartments = [
    {
      code: "A-102",
      title: "Jerusalem Family Apartment",
      city: "Jerusalem",
      status: "Active",
    }
  ];

  const paymentHistory = [
    {
      date: "Sep 12",
      type: "Rental Fee",
      amount: "₪50",
      status: "Paid",
    },
    {
      date: "Jan 01",
      type: "Yearly Listing",
      amount: "₪28",
      status: "Paid",
    },
    {
      date: "Aug 15",
      type: "Rental Fee",
      amount: "₪50",
      status: "Pending",
    }
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm">
            <svg className="h-8 w-8 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              {ownerName}
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
              Owner since Jan 2024
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center justify-center rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600 shadow-sm hover:bg-orange-100 dark:border-orange-900/30 dark:bg-orange-950/30 dark:text-orange-400 dark:hover:bg-orange-900/50 transition-colors">
            <BellRing className="mr-2 h-4 w-4" />
            Send Reminder
          </button>
          <button className="inline-flex items-center justify-center rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 shadow-sm hover:bg-red-100 dark:border-red-900/30 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors">
            <Ban className="mr-2 h-4 w-4" />
            Suspend Owner
          </button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-500/10">
              <Building2 className="h-5 w-5 text-blue-500" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
              Active
            </span>
          </div>
          <div>
            <div className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">3</div>
            <h3 className="mt-1 text-[15px] font-semibold text-zinc-900 dark:text-zinc-100">Listings</h3>
            <p className="mt-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">Currently active</p>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
              All time
            </span>
          </div>
          <div>
            <div className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">18</div>
            <h3 className="mt-1 text-[15px] font-semibold text-zinc-900 dark:text-zinc-100">Rentals</h3>
            <p className="mt-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">Completed stays</p>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-500/10">
              <Wallet className="h-5 w-5 text-purple-500" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400">
              Total
            </span>
          </div>
          <div>
            <div className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">₪1,250</div>
            <h3 className="mt-1 text-[15px] font-semibold text-zinc-900 dark:text-zinc-100">Earnings</h3>
            <p className="mt-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">Across all listings</p>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-500/10">
              <DollarSign className="h-5 w-5 text-orange-500" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400">
              Pending
            </span>
          </div>
          <div>
            <div className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">₪50</div>
            <h3 className="mt-1 text-[15px] font-semibold text-zinc-900 dark:text-zinc-100">Unpaid</h3>
            <p className="mt-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">Needs follow-up</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Contact Information */}
        <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
          <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 px-6 py-5 font-bold text-zinc-900 dark:text-white">
            <Phone className="h-5 w-5 text-blue-500" />
            Contact Information
          </div>
          <div className="p-6">
            <dl className="space-y-4 text-sm">
              <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-800/50 pb-4">
                <dt className="text-zinc-500 dark:text-zinc-400">Phone</dt>
                <dd className="font-bold text-zinc-900 dark:text-white">+972-50-123-4567</dd>
              </div>
              <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-800/50 pb-4">
                <dt className="text-zinc-500 dark:text-zinc-400">Email</dt>
                <dd className="font-bold text-zinc-900 dark:text-white">david@example.com</dd>
              </div>
              <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-800/50 pb-4">
                <dt className="text-zinc-500 dark:text-zinc-400">Language</dt>
                <dd className="font-bold text-zinc-900 dark:text-white">Hebrew</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-500 dark:text-zinc-400">Contact Method</dt>
                <dd className="font-bold text-zinc-900 dark:text-white">Phone + WhatsApp</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Account Activity */}
        <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
          <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 px-6 py-5 font-bold text-zinc-900 dark:text-white">
            <Activity className="h-5 w-5 text-purple-500" />
            Account Activity
          </div>
          <div className="p-6">
            <dl className="space-y-4 text-sm">
              <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-800/50 pb-4">
                <dt className="text-zinc-500 dark:text-zinc-400">Last Login</dt>
                <dd className="font-bold text-zinc-900 dark:text-white">2 hours ago</dd>
              </div>
              <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-800/50 pb-4">
                <dt className="text-zinc-500 dark:text-zinc-400">Availability Reminders</dt>
                <dd className="font-bold text-zinc-900 dark:text-white">Enabled</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-500 dark:text-zinc-400">Preferred Channel</dt>
                <dd className="font-bold text-zinc-900 dark:text-white">WhatsApp</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Owner's Apartments */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-6 py-5">
          <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-white">
            <Home className="h-5 w-5 text-orange-500" />
            Owner's Apartments
          </div>
          <button className="inline-flex items-center justify-center rounded-md border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-semibold text-zinc-700 shadow-sm hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700">
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50/50 dark:bg-zinc-800/30 text-zinc-900 dark:text-white font-semibold">
              <tr>
                <th className="px-6 py-3 border-b border-zinc-200 dark:border-zinc-800">Code</th>
                <th className="px-6 py-3 border-b border-zinc-200 dark:border-zinc-800">Title</th>
                <th className="px-6 py-3 border-b border-zinc-200 dark:border-zinc-800">City</th>
                <th className="px-6 py-3 border-b border-zinc-200 dark:border-zinc-800">Status</th>
                <th className="px-6 py-3 border-b border-zinc-200 dark:border-zinc-800 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {ownerApartments.map((apt, idx) => (
                <tr key={idx} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                  <td className="px-6 py-4 font-bold text-zinc-900 dark:text-white">{apt.code}</td>
                  <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">{apt.title}</td>
                  <td className="px-6 py-4 text-zinc-600 dark:text-zinc-300">{apt.city}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                      {apt.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      href={`/dashboard/apartments/${apt.code}`}
                      className="inline-flex items-center justify-center rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                    >
                      <Eye className="mr-1.5 h-3.5 w-3.5" />
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment History */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-6 py-5">
          <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-white">
            <Wallet className="h-5 w-5 text-emerald-500" />
            Payment History
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50/50 dark:bg-zinc-800/30 text-zinc-900 dark:text-white font-semibold">
              <tr>
                <th className="px-6 py-3 border-b border-zinc-200 dark:border-zinc-800">Date</th>
                <th className="px-6 py-3 border-b border-zinc-200 dark:border-zinc-800">Type</th>
                <th className="px-6 py-3 border-b border-zinc-200 dark:border-zinc-800">Amount</th>
                <th className="px-6 py-3 border-b border-zinc-200 dark:border-zinc-800">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {paymentHistory.map((payment, idx) => (
                <tr key={idx} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                  <td className="px-6 py-4 font-bold text-zinc-900 dark:text-white">{payment.date}</td>
                  <td className="px-6 py-4 text-zinc-600 dark:text-zinc-300">{payment.type}</td>
                  <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">{payment.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      payment.status === "Paid" 
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400"
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}
