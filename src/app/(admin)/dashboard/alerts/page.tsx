import { ShieldAlert, CheckCircle, Info } from "lucide-react";

export default function AlertsPage() {
  const alerts = [
    {
      id: 1,
      type: "critical",
      title: "System Update Required",
      message: "A critical security update is pending. Please update the server as soon as possible.",
      time: "10 mins ago",
      icon: ShieldAlert,
      color: "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400"
    },
    {
      id: 2,
      type: "success",
      title: "Database Backup Completed",
      message: "The daily automated database backup has completed successfully without errors.",
      time: "2 hours ago",
      icon: CheckCircle,
      color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400"
    },
    {
      id: 3,
      type: "info",
      title: "New User Registration",
      message: "A new admin account has been requested and is awaiting your approval.",
      time: "5 hours ago",
      icon: Info,
      color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400"
    }
  ];

  return (
    <div className="font-sans space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Alerts & Notifications</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Stay updated with the latest system activities and notifications.
        </p>
      </div>
      
      <div className="flex flex-col gap-4">
        {alerts.map((alert) => (
          <div key={alert.id} className="flex items-start gap-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${alert.color}`}>
              <alert.icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">{alert.title}</h3>
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{alert.time}</span>
              </div>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{alert.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
