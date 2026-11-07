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
  Gauge,
  Settings,
  ShieldCheck,
  Check,
} from "lucide-react";
import { DemoStore, DemoUserAccount } from "../demo-store";
import { useState, useRef, useEffect } from "react";

export default function ConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [resetting, setResetting] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activeUser, setActiveUser] = useState<DemoUserAccount | null>(null);
  const [allUsers, setAllUsers] = useState<DemoUserAccount[]>([]);
  const moreRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const refreshUser = () => {
    setActiveUser(DemoStore.getActiveUser());
    setAllUsers(DemoStore.getUserAccounts());
  };

  useEffect(() => {
    refreshUser();
    const unsub = DemoStore.subscribe(refreshUser);
    return () => unsub();
  }, []);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const primaryNav = [
    { href: "/dashboard", label: "Boilers", icon: LayoutDashboard },
    { href: "/steam", label: "Steam Records", icon: Gauge },
    { href: "/procurement", label: "Procurement", icon: ShoppingBag },
    { href: "/inventory", label: "Inventory", icon: Boxes },
    { href: "/maintenance", label: "Maintenance", icon: Wrench },
    { href: "/invoicing", label: "Invoicing", icon: FileText },
    { href: "/lab", label: "Water Lab", icon: TestTube2 },
    { href: "/hr", label: "Staff", icon: Users },
  ];

  const secondaryNav = [
    { href: "/sites", label: "Client Sites", icon: Building2, desc: "Industrial plants & stationed supervisors/foremen" },
    { href: "/expenses", label: "Expenses & Vouchers", icon: Receipt, desc: "Operational costs, payroll salaries & vouchers" },
    { href: "/deliveries", label: "Fuel Deliveries", icon: Truck, desc: "Biomass truck weighbridge & proof verification" },
    { href: "/cash", label: "Petty Cash Floats", icon: DollarSign, desc: "Site supervisor float balances and disbursements" },
    { href: "/ledgers", label: "Financial Ledgers", icon: BookOpen, desc: "Double-entry operational accounting" },
    { href: "/settings", label: "System Settings", icon: Settings, desc: "Stock categories, units, users & permissions" },
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

  const handleSwitchUser = (userId: string) => {
    DemoStore.setActiveUser(userId);
    setIsUserMenuOpen(false);
  };

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case "Super Admin":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "Site Supervisor":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "Boiler Foreman":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Accounts & Finance":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Plant Manager":
        return "bg-orange-100 text-[#FF6600] border-orange-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
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
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
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
                <span>More</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${isMoreOpen ? "rotate-180" : ""}`} />
              </button>

              {isMoreOpen && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Additional Modules
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

          {/* Right: Quick Demo Controls & User Account Switcher */}
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
              <span className="hidden sm:inline">Field App</span>
            </Link>

            {/* Notification Bell */}
            <div className="relative hidden md:block">
              <button className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors">
                <Bell className="w-4 h-4" />
              </button>
              <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[#FF6600] ring-2 ring-white" />
            </div>

            {/* User Profile & Account Switcher Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 pl-1.5 pr-2 py-1 rounded-full hover:bg-gray-100 border border-transparent hover:border-gray-200 transition-all text-left"
              >
                <img
                  src={activeUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                  alt={activeUser?.name || "User"}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-orange-500/30"
                />
                <div className="hidden lg:flex flex-col text-left max-w-[120px]">
                  <span className="text-xs font-bold text-gray-900 leading-none truncate">
                    {activeUser?.name || "User"}
                  </span>
                  <span className="text-[10px] text-gray-500 font-medium mt-0.5 truncate">
                    {activeUser?.role || "Staff"}
                  </span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {isUserMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-2">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Switch Active Role / User
                      </span>
                      <span className="text-[11px] text-gray-500">
                        Simulate user views & permissions
                      </span>
                    </div>
                    <Link
                      href="/settings"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="p-1 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-[#FF6600]"
                      title="Manage User Permissions in Settings"
                    >
                      <Settings className="w-4 h-4" />
                    </Link>
                  </div>

                  <div className="space-y-1.5 max-h-72 overflow-y-auto">
                    {allUsers.map((u) => {
                      const isSelected = activeUser?.id === u.id;
                      return (
                        <button
                          key={u.id}
                          onClick={() => handleSwitchUser(u.id)}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                            isSelected
                              ? "bg-orange-50/80 border border-orange-200"
                              : "hover:bg-gray-50 border border-transparent"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={u.avatar}
                              alt={u.name}
                              className="w-7 h-7 rounded-full object-cover shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-gray-900 truncate flex items-center gap-1.5">
                                <span>{u.name}</span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-[#FF6600]" />}
                              </div>
                              <div className="text-[10px] text-gray-500 truncate">{u.assignedSite}</div>
                            </div>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${getRoleBadgeColor(u.role)}`}>
                            {u.role}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-2.5 mt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                    <span className="text-gray-500 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Role-based access active
                    </span>
                    <Link
                      href="/settings"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="font-bold text-[#FF6600] hover:underline"
                    >
                      Permissions &rarr;
                    </Link>
                  </div>
                </div>
              )}
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
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors shrink-0 ${
                  isActive
                    ? "bg-[#181B20] text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#FF6600]" : "text-gray-500"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </header>

      {/* Main App Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
