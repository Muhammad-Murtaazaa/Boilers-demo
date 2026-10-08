"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Flame,
  LayoutDashboard,
  Wrench,
  ShoppingBag,
  Boxes,
  FileText,
  TestTube2,
  Users,
  Building2,
  Receipt,
  Truck,
  DollarSign,
  Smartphone,
  Bell,
  RefreshCw,
  ChevronDown,
  Layers,
  BookOpen,
} from "lucide-react";
import { DemoStore } from "../demo-store";
import { useState, useRef, useEffect } from "react";

export default function ConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [resetting, setResetting] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const primaryNav = [
    { href: "/dashboard", label: "Boilers", icon: LayoutDashboard },
    { href: "/maintenance", label: "Maintenance", icon: Wrench },
    { href: "/procurement", label: "Procurement", icon: ShoppingBag },
    { href: "/inventory", label: "Inventory", icon: Boxes },
    { href: "/invoicing", label: "Invoicing", icon: FileText },
    { href: "/lab", label: "Water Lab", icon: TestTube2 },
    { href: "/hr", label: "Staff", icon: Users },
  ];

  const secondaryNav = [
    { href: "/sites", label: "Client Sites", icon: Building2, desc: "Industrial manufacturing customer facilities" },
    { href: "/expenses", label: "Running Expenses", icon: Receipt, desc: "Daily on-site operational cost ledger" },
    { href: "/deliveries", label: "Fuel Deliveries", icon: Truck, desc: "Biomass truck weighbridge & proof verification" },
    { href: "/cash", label: "Petty Cash Floats", icon: DollarSign, desc: "Site supervisor float balances and disbursements" },
    { href: "/ledgers", label: "Financial Ledgers", icon: BookOpen, desc: "Double-entry operational accounting" },
  ];

  const isSecondaryActive = secondaryNav.some((item) => pathname === item.href);

  const handleReset = () => {
    setResetting(true);
    DemoStore.resetStore();
    setTimeout(() => {
      setResetting(false);
      window.location.reload();
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#F3F4F7] text-[#111827] flex flex-col antialiased">
      {/* Top Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] px-3 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Left: Brand Logo & Title */}
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-2xl bg-[#FF6600] flex items-center justify-center text-white shadow-[0_4px_12px_rgba(255,102,0,0.3)] group-hover:scale-105 transition-transform duration-200">
                <Flame className="w-5 h-5 fill-white text-white" />
              </div>
              <div className="flex flex-col">
                <div className="font-extrabold text-base sm:text-lg tracking-tight font-[family-name:var(--font-display)] flex items-center gap-1.5 leading-none">
                  <span className="text-[#111827]">Stoker</span>
                  <span className="text-[#FF6600]">Boilers</span>
                </div>
                <span className="text-[10px] text-gray-500 font-medium tracking-wide">
                  Enterprise Steam Operations
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Sleek Navigation Bar */}
          <nav className="hidden xl:flex items-center bg-[#F3F4F7] p-1 rounded-full border border-gray-200 gap-0.5 shadow-inner">
            {primaryNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? "bg-[#181B20] text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/80"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#FF6600]" : "text-gray-500"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* More ERP Modules Dropdown */}
            <div className="relative" ref={moreRef}>
              <button
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  isSecondaryActive || isMoreOpen
                    ? "bg-[#181B20] text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/80"
                }`}
              >
                <Layers className={`w-3.5 h-3.5 ${isSecondaryActive || isMoreOpen ? "text-[#FF6600]" : "text-gray-500"}`} />
                <span>Operations</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${isMoreOpen ? "rotate-180" : ""}`} />
              </button>

              {isMoreOpen && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Additional ERP Modules
                  </div>
                  {secondaryNav.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMoreOpen(false)}
                        className={`flex items-start gap-3 p-2.5 rounded-xl text-xs transition-colors ${
                          isActive
                            ? "bg-orange-50 text-[#FF6600]"
                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg shrink-0 ${isActive ? "bg-orange-100 text-[#FF6600]" : "bg-gray-100 text-gray-500"}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold">{item.label}</div>
                          <div className="text-[10px] text-gray-400 line-clamp-1">{item.desc}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Right: Quick Demo Controls & Profile */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Quick Demo Reset Button */}
            <button
              onClick={handleReset}
              title="Reset All Demo Data"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full border border-gray-200 transition-colors"
            >
              <RefreshCw className={`w-3 h-3 text-[#FF6600] ${resetting ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>

            {/* Field Simulation Shortcut */}
            <Link
              href="/simulator"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#FF6600] bg-orange-50 hover:bg-orange-100 rounded-full border border-orange-200 transition-colors"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Field Mobile</span>
            </Link>

            {/* Notification Bell */}
            <div className="relative hidden md:block">
              <button className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors">
                <Bell className="w-4 h-4" />
              </button>
              <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[#FF6600] ring-2 ring-white" />
            </div>

            {/* User Profile Avatar */}
            <div className="flex items-center gap-2 pl-1 border-l border-gray-200">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Plant Director"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-orange-500/30"
              />
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-bold text-gray-900 leading-none">Operations Director</span>
                <span className="text-[10px] text-gray-400 font-medium mt-0.5">Enterprise Admin</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Sub-bar for medium / tablet / mobile devices */}
        <div className="flex xl:hidden overflow-x-auto gap-1 pt-2.5 pb-1 border-t border-gray-100 mt-2 scrollbar-none">
          {[...primaryNav, ...secondaryNav].map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-[#181B20] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#FF6600]" : "text-gray-500"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
