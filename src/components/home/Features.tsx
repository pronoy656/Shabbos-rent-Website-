import { Navigation, ArrowRightLeft, Bell, ShieldCheck } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <Navigation className="w-6 h-6 text-[#4c55a4]" />,
      title: "Walking Distance Search",
      description: "Find places within your walking distance"
    },
    {
      icon: <ArrowRightLeft className="w-6 h-6 text-emerald-500" />,
      title: "Apartment Swap",
      description: "Exchange your apartment with other owners"
    },
    {
      icon: <Bell className="w-6 h-6 text-amber-500" />,
      title: "Instant Alerts",
      description: "Get notified when matching apartments are available"
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#4c55a4]" />,
      title: "Secure & Trusted",
      description: "Verified owners and safe payments"
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 mt-8 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 bg-zinc-50 dark:bg-zinc-900/50 p-6 md:p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800">
        {features.map((feature, idx) => (
          <div key={idx} className="flex items-start gap-4">
            <div className="shrink-0 w-12 h-12 rounded-full bg-white dark:bg-zinc-800 shadow-sm border border-zinc-100 dark:border-zinc-700 flex items-center justify-center">
              {feature.icon}
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-1">{feature.title}</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium leading-snug">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
