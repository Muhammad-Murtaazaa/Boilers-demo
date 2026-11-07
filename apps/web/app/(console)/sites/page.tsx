"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2,
  MapPin,
  Flame,
  Users,
  Search,
  ShieldCheck,
  UserCheck,
  Gauge,
  Phone,
  ChevronRight,
} from "lucide-react";
import { DemoStore } from "../../demo-store";

export default function SitesConsolePage() {
  const boilers = DemoStore.getBoilers();
  const staff = DemoStore.getStaff();
  const users = DemoStore.getUserAccounts();
  const [search, setSearch] = useState("");

  const sites = [
    {
      id: "site-01",
      name: "Apex Textile Mills - Sector 4",
      client: "Apex Textiles Ltd",
      location: "Faisalabad Industrial Area, Site #04",
      boilerCount: boilers.filter((b) => b.siteName.includes("Apex")).length || 1,
      staffCount: staff.filter((s) => s.assignedSite.includes("Apex")).length || 3,
      supervisor: {
        name: "Tariq Mahmood",
        role: "Site Supervisor",
        phone: "+92 300 1234567",
        avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80",
      },
      foreman: {
        name: "Liam Harper",
        role: "Boiler Foreman & Lead Operator",
        phone: "+92 300 8472911",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      },
      boilerModel: "Thermax SteamMax 5T (5,000 kg/hr)",
      fuelType: "Biomass Briquettes (Cotton Stalk)",
      status: "Active",
    },
    {
      id: "site-02",
      name: "GreenBio Bio-Refinery Unit 2",
      client: "GreenBio Chemical Plant",
      location: "Sheikhupura Road, Zone B, Lahore",
      boilerCount: boilers.filter((b) => b.siteName.includes("GreenBio")).length || 1,
      staffCount: staff.filter((s) => s.assignedSite.includes("GreenBio")).length || 2,
      supervisor: {
        name: "Zubair Khan",
        role: "Plant Manager & Supervisor",
        phone: "+92 333 5551212",
        avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop&q=80",
      },
      foreman: {
        name: "Noah Bennett",
        role: "Boiler Foreman & Lead Tech",
        phone: "+92 321 4455667",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
      },
      boilerModel: "Volta Steam G-5000 (8,500 kg/hr)",
      fuelType: "Wood Pellets (Grade A)",
      status: "Active",
    },
    {
      id: "site-03",
      name: "Prime Mills - Boiler Bay C",
      client: "Prime Sugar Refineries",
      location: "Sugar Mill Road, Multan",
      boilerCount: boilers.filter((b) => b.siteName.includes("Prime")).length || 1,
      staffCount: staff.filter((s) => s.assignedSite.includes("Prime")).length || 1,
      supervisor: {
        name: "Logan Pierce",
        role: "Maintenance Specialist & Supervisor",
        phone: "+92 302 7788990",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80",
      },
      foreman: {
        name: "Logan Pierce",
        role: "Boiler Lead Foreman",
        phone: "+92 302 7788990",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80",
      },
      boilerModel: "Eco-Steam Pro 800kW (3,200 kg/hr)",
      fuelType: "Bagasse & Agricultural Pellets",
      status: "In Maintenance",
    },
    {
      id: "site-04",
      name: "SunGlow Dairy & Beverage Plant",
      client: "SunGlow Food Processing",
      location: "Kot Lakhpat Industrial Estate, Lahore",
      boilerCount: boilers.filter((b) => b.siteName.includes("SunGlow")).length || 1,
      staffCount: staff.filter((s) => s.assignedSite.includes("SunGlow")).length || 2,
      supervisor: {
        name: "Mason Clarke",
        role: "Shift Supervisor",
        phone: "+92 306 1122334",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
      },
      foreman: {
        name: "Farhan Saeed",
        role: "Boiler Foreman (Fuel Feeder Lead)",
        phone: "+92 307 4455889",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80",
      },
      boilerModel: "AquaSteam G-2500 Pack (2,500 kg/hr)",
      fuelType: "Agri-Biomass Pellets",
      status: "Active",
    },
    {
      id: "site-05",
      name: "Crescent Mill Complex - Bay #1",
      client: "Crescent Paper Mills",
      location: "Gujranwala Road, Plant 1",
      boilerCount: boilers.filter((b) => b.siteName.includes("Crescent")).length || 1,
      staffCount: staff.filter((s) => s.assignedSite.includes("Crescent")).length || 1,
      supervisor: {
        name: "Lucas Reed",
        role: "Station Lead Supervisor",
        phone: "+92 312 9988776",
        avatar: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=100&auto=format&fit=crop&q=80",
      },
      foreman: {
        name: "Lucas Reed",
        role: "Boiler Operator Foreman",
        phone: "+92 312 9988776",
        avatar: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=100&auto=format&fit=crop&q=80",
      },
      boilerModel: "Thermax SteamMax 8T Heavy (8,000 kg/hr)",
      fuelType: "Rice Husk Pellets",
      status: "Standby",
    },
    {
      id: "site-06",
      name: "Indus Wet Processing Zone",
      client: "Indus Dyeing & Bleaching",
      location: "Nooriabad Industrial Estate, Sindh",
      boilerCount: boilers.filter((b) => b.siteName.includes("Indus")).length || 1,
      staffCount: staff.filter((s) => s.assignedSite.includes("Indus")).length || 2,
      supervisor: {
        name: "Elijah Brooks",
        role: "Site Supervisor",
        phone: "+92 314 5566778",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80",
      },
      foreman: {
        name: "Bilal Warraich",
        role: "Boiler Foreman (Maintenance Lead)",
        phone: "+92 315 2233445",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
      },
      boilerModel: "Volta Steam Industrial 600 (6,000 kg/hr)",
      fuelType: "Cotton Stalk Briquettes",
      status: "Active",
    },
  ];

  const filtered = sites.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.client.toLowerCase().includes(search.toLowerCase()) ||
      s.location.toLowerCase().includes(search.toLowerCase()) ||
      s.supervisor.name.toLowerCase().includes(search.toLowerCase()) ||
      s.foreman.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-100 text-[#FF6600] uppercase tracking-wider">
              Deployment Facilities
            </span>
            <span className="text-xs text-gray-500 font-medium">Stationed Personnel & Station Oversight</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight font-[family-name:var(--font-display)] mt-1">
            Client Facility Sites
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manufacturing plants hosting Stoker steam generators with appointed Site Supervisors and Boiler Foremen.
          </p>
        </div>

        <div className="bg-white px-4 py-2.5 rounded-2xl border border-gray-200 shadow-sm shrink-0">
          <span className="text-[10px] font-bold text-gray-400 block uppercase">Operational Footprint</span>
          <span className="text-base font-extrabold text-gray-900">{sites.length} Active Industrial Facilities</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-gray-200/90 shadow-sm space-y-6">
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-gray-100">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search facility sites, clients, supervisors, foremen..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#F3F4F7] text-xs rounded-xl border border-transparent focus:border-[#FF6600] focus:bg-white focus:outline-none placeholder:text-gray-400"
            />
          </div>

          <Link
            href="/steam"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#FF6600] bg-orange-50 hover:bg-orange-100 border border-orange-200"
          >
            <Gauge className="w-4 h-4" />
            <span>Steam Telemetry</span>
          </Link>
        </div>

        {/* Sites Grid with Supervisor & Foreman Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((s) => (
            <div
              key={s.id}
              className="p-5 rounded-2xl bg-[#F8F9FB] border border-gray-200/80 hover:border-orange-300 transition-all flex flex-col justify-between space-y-4 hover:shadow-sm"
            >
              <div>
                {/* Site Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF6600] flex items-center justify-center font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    s.status === "Active"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : s.status === "Standby"
                      ? "bg-gray-100 text-gray-700 border-gray-300"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}>
                    ● {s.status}
                  </span>
                </div>

                <h3 className="font-extrabold text-sm sm:text-base text-gray-900 mt-3 leading-snug">{s.name}</h3>
                <span className="text-xs text-gray-500 font-semibold block mt-0.5">{s.client}</span>

                <div className="flex items-center gap-1.5 mt-2 text-[11px] text-gray-600">
                  <MapPin className="w-3.5 h-3.5 text-[#FF6600] shrink-0" />
                  <span className="truncate">{s.location}</span>
                </div>

                {/* Boiler & Fuel Info */}
                <div className="mt-3 p-2.5 rounded-xl bg-white border border-gray-200/70 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Boiler:</span>
                    <span className="font-bold text-gray-900">{s.boilerModel}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-500">Fuel:</span>
                    <span className="font-semibold text-orange-600">{s.fuelType}</span>
                  </div>
                </div>

                {/* STATIONED SUPERVISOR & FOREMAN */}
                <div className="mt-3 pt-3 border-t border-gray-200/60 space-y-2.5">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                    Station Personnel Leadership
                  </div>

                  {/* 1. Site Supervisor */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50/70 border border-amber-200/60">
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={s.supervisor.avatar}
                        alt={s.supervisor.name}
                        className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-amber-400"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-extrabold text-gray-900 truncate">
                          {s.supervisor.name}
                        </div>
                        <div className="text-[9px] font-bold text-amber-800">
                          Site Supervisor
                        </div>
                      </div>
                    </div>
                    <a
                      href={`tel:${s.supervisor.phone}`}
                      className="p-1 rounded-lg text-amber-700 hover:bg-amber-100"
                      title={s.supervisor.phone}
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* 2. Boiler Foreman */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-blue-50/70 border border-blue-200/60">
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={s.foreman.avatar}
                        alt={s.foreman.name}
                        className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-blue-400"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-extrabold text-gray-900 truncate">
                          {s.foreman.name}
                        </div>
                        <div className="text-[9px] font-bold text-blue-800">
                          Boiler Foreman
                        </div>
                      </div>
                    </div>
                    <a
                      href={`tel:${s.foreman.phone}`}
                      className="p-1 rounded-lg text-blue-700 hover:bg-blue-100"
                      title={s.foreman.phone}
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Footer Tally */}
              <div className="pt-3 border-t border-gray-200/60 flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-1 text-gray-700">
                  <Flame className="w-3.5 h-3.5 text-[#FF6600]" />
                  <span>{s.boilerCount} Boiler Active</span>
                </span>

                <span className="flex items-center gap-1 text-gray-700">
                  <Users className="w-3.5 h-3.5 text-sky-600" />
                  <span>{s.staffCount} Station Crew</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
