"use client";

import { useState, useEffect } from "react";
import {
  Gauge,
  Flame,
  Plus,
  Search,
  Calendar,
  Camera,
  Image as ImageIcon,
  CheckCircle2,
  TrendingUp,
  Clock,
  Building2,
  Eye,
  X,
  FileCheck,
  ChevronRight,
  Filter,
} from "lucide-react";
import { DemoStore, DemoSteamRecord, DemoBoiler, DemoUserAccount } from "../../demo-store";

const METER_IMAGE_PRESETS = [
  {
    name: "Standard Flow Meter Dial (8.4 Bar)",
    url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
  },
  {
    name: "Digital Vortex Flow Telemetry (10.5 Bar)",
    url: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80",
  },
  {
    name: "High-Temp Pressure Manifold (12.0 Bar)",
    url: "https://images.unsplash.com/photo-1618042164219-62c820f10723?w=800&auto=format&fit=crop&q=80",
  },
];

const STEAM_IMAGE_PRESETS = [
  {
    name: "Superheated Steam Header Discharge",
    url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80",
  },
  {
    name: "Main Steam Manifold & Safety Valve Line",
    url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80",
  },
  {
    name: "Boiler Fire Chamber & Stoker Flame Glass",
    url: "https://images.unsplash.com/photo-1581092446327-9b52bd1570c2?w=800&auto=format&fit=crop&q=80",
  },
];

export default function SteamProductionPage() {
  const [steamRecords, setSteamRecords] = useState<DemoSteamRecord[]>([]);
  const [boilers, setBoilers] = useState<DemoBoiler[]>([]);
  const [activeUser, setActiveUser] = useState<DemoUserAccount | null>(null);

  // Filters & Tabs
  const [viewPeriod, setViewPeriod] = useState<"ALL" | "DAILY" | "WEEKLY" | "MONTHLY">("ALL");
  const [boilerFilter, setBoilerFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal: Log Steam Shift Reading
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [selectedBoilerId, setSelectedBoilerId] = useState("");
  const [shiftDate, setShiftDate] = useState(new Date().toISOString().slice(0, 10));
  const [shiftName, setShiftName] = useState<DemoSteamRecord["shift"]>("Morning (06:00 - 14:00)");
  const [readingInitial, setReadingInitial] = useState("14560.0");
  const [readingFinal, setReadingFinal] = useState("14598.5");
  const [steamPressure, setSteamPressure] = useState("8.5");
  const [steamTemp, setSteamTemp] = useState("174.0");
  const [fuelConsumed, setFuelConsumed] = useState("8.2");
  const [meterPhoto, setMeterPhoto] = useState(METER_IMAGE_PRESETS[0]?.url || "");
  const [steamPhoto, setSteamPhoto] = useState(STEAM_IMAGE_PRESETS[0]?.url || "");
  const [supervisorName, setSupervisorName] = useState("Tariq Mahmood");
  const [foremanName, setForemanName] = useState("Liam Harper");
  const [shiftNotes, setShiftNotes] = useState("");

  // Lightbox Proof Modal
  const [lightboxRecord, setLightboxRecord] = useState<DemoSteamRecord | null>(null);

  const refreshData = () => {
    setSteamRecords(DemoStore.getSteamRecords());
    const bList = DemoStore.getBoilers();
    setBoilers(bList);
    const u = DemoStore.getActiveUser();
    setActiveUser(u);
    if (bList.length > 0 && !selectedBoilerId) {
      setSelectedBoilerId(bList[0]?.id || "");
    }
    if (u) {
      if (u.role === "Boiler Foreman") setForemanName(u.name);
      if (u.role === "Site Supervisor") setSupervisorName(u.name);
    }
  };

  useEffect(() => {
    refreshData();
    const unsub = DemoStore.subscribe(refreshData);
    return () => unsub();
  }, []);

  // Net steam calculation
  const calculatedSteam = Math.max(
    0,
    Number((parseFloat(readingFinal || "0") - parseFloat(readingInitial || "0")).toFixed(1))
  );

  const handleLogRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const b = boilers.find((item) => item.id === selectedBoilerId) || boilers[0];
    if (!b) return;

    DemoStore.addSteamRecord({
      date: shiftDate,
      shift: shiftName,
      boilerId: b.id,
      boilerModel: b.model,
      siteName: b.siteName,
      meterReadingInitial: parseFloat(readingInitial) || 0,
      meterReadingFinal: parseFloat(readingFinal) || 0,
      steamGeneratedTons: calculatedSteam,
      steamPressureBar: parseFloat(steamPressure) || 0,
      steamTemperatureC: parseFloat(steamTemp) || 0,
      fuelConsumedTons: parseFloat(fuelConsumed) || 0,
      fuelType: b.fuelType,
      meterPhotoUrl: meterPhoto,
      steamPhotoUrl: steamPhoto,
      supervisorName: supervisorName || "Site Supervisor",
      foremanName: foremanName || "Boiler Foreman",
      notes: shiftNotes || "Shift log logged via digital operations console.",
    });

    setIsLogModalOpen(false);
    setShiftNotes("");
  };

  // Filter records
  const filteredRecords = steamRecords.filter((rec) => {
    const matchesBoiler = boilerFilter === "All" || rec.boilerId === boilerFilter;
    const matchesSearch =
      rec.recordNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.siteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.boilerModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.supervisorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.foremanName.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesBoiler || !matchesSearch) return false;

    if (viewPeriod === "DAILY") {
      const today = new Date().toISOString().slice(0, 10);
      return rec.date === today || rec.date === "2026-10-07" || rec.date === "2026-10-06";
    }
    if (viewPeriod === "WEEKLY") {
      return rec.date >= "2026-10-01";
    }
    if (viewPeriod === "MONTHLY") {
      return true;
    }
    return true;
  });

  // Aggregates
  const totalSteamGenerated = filteredRecords.reduce((sum, r) => sum + r.steamGeneratedTons, 0);
  const totalFuelConsumed = filteredRecords.reduce((sum, r) => sum + r.fuelConsumedTons, 0);
  const avgPressure = filteredRecords.length
    ? Number((filteredRecords.reduce((sum, r) => sum + r.steamPressureBar, 0) / filteredRecords.length).toFixed(1))
    : 0;
  const steamEfficiency = totalFuelConsumed > 0 ? Number((totalSteamGenerated / totalFuelConsumed).toFixed(2)) : 4.8;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-100 text-[#FF6600] uppercase tracking-wider">
              Steam Production Logs
            </span>
            <span className="text-xs text-gray-500 font-medium">Daily · Weekly · Monthly Reports</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 mt-1">
            Steam Generation & Meter Proofs
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Shift-by-shift steam delivery records with verifiable flow meter readings and boiler steam discharge photo captures.
          </p>
        </div>

        <button
          onClick={() => setIsLogModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#FF6600] hover:bg-[#E65C00] rounded-xl shadow-sm hover:shadow transition-all shrink-0"
        >
          <Camera className="w-4 h-4" />
          <span>Log Steam Reading & Photos</span>
        </button>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Total Steam Delivered
            </span>
            <div className="p-2 rounded-xl bg-orange-50 text-[#FF6600]">
              <Gauge className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-gray-900 font-mono tracking-tight">
              {totalSteamGenerated.toFixed(1)}{" "}
              <span className="text-xs font-bold text-gray-500">Tonnes</span>
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>Shift quota on track (+3.8%)</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Fuel Efficiency Ratio
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-gray-900 font-mono tracking-tight">
              {steamEfficiency}{" "}
              <span className="text-xs font-bold text-gray-500">kg Steam / kg Fuel</span>
            </div>
            <div className="text-[11px] text-gray-500 mt-1">
              Fuel Burned: <span className="font-bold text-gray-900">{totalFuelConsumed.toFixed(1)}t</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Avg Steam Pressure
            </span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-gray-900 font-mono tracking-tight">
              {avgPressure}{" "}
              <span className="text-xs font-bold text-gray-500">Bar (G)</span>
            </div>
            <div className="text-[11px] text-gray-500 mt-1">
              Design Nominal: 8.0 - 12.0 Bar
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Shift Records Verified
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-gray-900 font-mono tracking-tight">
              {filteredRecords.length}{" "}
              <span className="text-xs font-bold text-gray-500">Logs</span>
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>100% Dual-Photo Attached</span>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Period Filter + Boiler Select + Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Period Selector Tabs */}
        <div className="flex items-center bg-[#F3F4F7] p-1 rounded-xl border border-gray-200/80 w-full md:w-auto">
          {(["ALL", "DAILY", "WEEKLY", "MONTHLY"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setViewPeriod(tab)}
              className={`flex-1 md:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewPeriod === tab
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {tab === "ALL" && "All Logs"}
              {tab === "DAILY" && "Daily Shift View"}
              {tab === "WEEKLY" && "Weekly Aggregation"}
              {tab === "MONTHLY" && "Monthly Report"}
            </button>
          ))}
        </div>

        {/* Boiler & Search Filter */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <select
            value={boilerFilter}
            onChange={(e) => setBoilerFilter(e.target.value)}
            className="px-3 py-2 text-xs font-medium border border-gray-200 rounded-xl bg-white text-gray-700 focus:outline-none focus:border-[#FF6600]"
          >
            <option value="All">All Boilers & Sites</option>
            {boilers.map((b) => (
              <option key={b.id} value={b.id}>
                {b.code} - {b.model}
              </option>
            ))}
          </select>

          <div className="relative flex-1 md:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search records, supervisor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
            />
          </div>
        </div>
      </div>

      {/* Steam Records Table */}
      <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-extrabold text-sm sm:text-base text-gray-900">
              Shift Steam Production Ledger
            </h2>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-bold">
              {filteredRecords.length} shifts recorded
            </span>
          </div>

          <div className="text-[11px] text-gray-500 font-medium">
            Click any thumbnail to inspect both photos full-screen
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFBFD] border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Shift & Log No</th>
                <th className="py-3 px-4">Boiler Deployment & Site</th>
                <th className="py-3 px-4 text-center">Meter Reading (Init &rarr; Final)</th>
                <th className="py-3 px-4 text-center">Net Steam</th>
                <th className="py-3 px-4 text-center">Pressure & Temp</th>
                <th className="py-3 px-4 text-center">Fuel Burned</th>
                <th className="py-3 px-4 text-center">Dual Photos (Meter + Steam)</th>
                <th className="py-3 px-4">Stationed Crew</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-gray-50/80 transition-colors">
                  {/* Shift & Date */}
                  <td className="py-3 px-4">
                    <div className="font-mono font-bold text-gray-900">{rec.recordNumber}</div>
                    <div className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span>{rec.date}</span>
                    </div>
                    <div className="text-[10px] font-semibold text-orange-600 mt-0.5">
                      {rec.shift}
                    </div>
                  </td>

                  {/* Boiler & Site */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-gray-900">{rec.boilerModel}</div>
                    <div className="text-[11px] text-gray-500 line-clamp-1">{rec.siteName}</div>
                  </td>

                  {/* Meter Reading Initial -> Final */}
                  <td className="py-3 px-4 text-center">
                    <div className="font-mono text-xs font-semibold text-gray-700">
                      {rec.meterReadingInitial.toFixed(1)} &rarr; {rec.meterReadingFinal.toFixed(1)}
                    </div>
                    <div className="text-[10px] text-gray-400">cumulative units</div>
                  </td>

                  {/* Net Steam */}
                  <td className="py-3 px-4 text-center">
                    <span className="font-mono font-extrabold text-sm text-[#FF6600] px-2.5 py-0.5 rounded-lg bg-orange-50 border border-orange-200">
                      {rec.steamGeneratedTons.toFixed(1)} Tonnes
                    </span>
                  </td>

                  {/* Pressure & Temp */}
                  <td className="py-3 px-4 text-center">
                    <div className="font-mono font-bold text-gray-900">
                      {rec.steamPressureBar} Bar
                    </div>
                    <div className="text-[10px] text-gray-500">{rec.steamTemperatureC}°C</div>
                  </td>

                  {/* Fuel Burned */}
                  <td className="py-3 px-4 text-center">
                    <div className="font-mono font-bold text-gray-800">
                      {rec.fuelConsumedTons.toFixed(1)} Tonnes
                    </div>
                    <div className="text-[10px] text-gray-400 truncate max-w-[120px] mx-auto">
                      {rec.fuelType}
                    </div>
                  </td>

                  {/* Dual Photo Thumbnails */}
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {/* Photo 1: Meter Reading */}
                      <button
                        onClick={() => setLightboxRecord(rec)}
                        title="Click to inspect Meter Reading Proof"
                        className="group relative w-10 h-10 rounded-lg overflow-hidden border border-gray-200 ring-1 ring-black/5 hover:ring-orange-500 transition-all shrink-0"
                      >
                        <img
                          src={rec.meterPhotoUrl}
                          alt="Meter Reading"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Eye className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="absolute bottom-0 right-0 bg-black/70 text-[8px] font-bold text-white px-1 rounded-tl">
                          Meter
                        </span>
                      </button>

                      {/* Photo 2: Steam Discharge / Sight Glass */}
                      <button
                        onClick={() => setLightboxRecord(rec)}
                        title="Click to inspect Steam Output Proof"
                        className="group relative w-10 h-10 rounded-lg overflow-hidden border border-gray-200 ring-1 ring-black/5 hover:ring-orange-500 transition-all shrink-0"
                      >
                        <img
                          src={rec.steamPhotoUrl}
                          alt="Steam Output"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Eye className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="absolute bottom-0 right-0 bg-orange-600/90 text-[8px] font-bold text-white px-1 rounded-tl">
                          Steam
                        </span>
                      </button>
                    </div>
                  </td>

                  {/* Stationed Crew */}
                  <td className="py-3 px-4">
                    <div className="text-[11px] font-semibold text-gray-900">
                      Supv: <span className="text-gray-700">{rec.supervisorName}</span>
                    </div>
                    <div className="text-[10px] text-gray-500">
                      Foreman: <span className="text-gray-600">{rec.foremanName}</span>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setLightboxRecord(rec)}
                      className="px-2.5 py-1 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-orange-50 hover:text-[#FF6600] rounded-lg transition-colors border border-gray-200"
                    >
                      Inspect Proof
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: LOG SHIFT STEAM READING & 2 PHOTOS */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-gray-100 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-extrabold text-base text-gray-900">
                  Log Shift Steam Record & Photo Proofs
                </h3>
                <p className="text-xs text-gray-500">
                  Record digital flow telemetry and attach required photographic meter & steam proofs.
                </p>
              </div>
              <button
                onClick={() => setIsLogModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleLogRecord} className="space-y-4 mt-4">
              {/* Row 1: Boiler & Date & Shift */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Target Boiler</label>
                  <select
                    value={selectedBoilerId}
                    onChange={(e) => setSelectedBoilerId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                  >
                    {boilers.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.code} - {b.model}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Shift Date</label>
                  <input
                    type="date"
                    value={shiftDate}
                    onChange={(e) => setShiftDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Shift Rotation</label>
                  <select
                    value={shiftName}
                    onChange={(e) => setShiftName(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                  >
                    <option value="Morning (06:00 - 14:00)">Morning (06:00 - 14:00)</option>
                    <option value="Evening (14:00 - 22:00)">Evening (14:00 - 22:00)</option>
                    <option value="Night (22:00 - 06:00)">Night (22:00 - 06:00)</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Meter Readings */}
              <div className="p-3.5 rounded-xl bg-orange-50/60 border border-orange-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#FF6600] uppercase tracking-wider">
                    Steam Flow Meter Calculation
                  </span>
                  <span className="text-xs font-extrabold text-gray-900 font-mono">
                    Net Output: {calculatedSteam} Tonnes
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Initial Meter Reading
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={readingInitial}
                      onChange={(e) => setReadingInitial(e.target.value)}
                      required
                      className="w-full px-3 py-1.5 text-xs font-mono font-bold border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF6600]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Final Meter Reading
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={readingFinal}
                      onChange={(e) => setReadingFinal(e.target.value)}
                      required
                      className="w-full px-3 py-1.5 text-xs font-mono font-bold border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF6600]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Pressure (Bar G)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={steamPressure}
                      onChange={(e) => setSteamPressure(e.target.value)}
                      required
                      className="w-full px-3 py-1.5 text-xs font-mono font-bold border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF6600]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Temperature (°C)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={steamTemp}
                      onChange={(e) => setSteamTemp(e.target.value)}
                      required
                      className="w-full px-3 py-1.5 text-xs font-mono font-bold border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF6600]"
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: Fuel Consumed & Stationed Staff */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Fuel Consumed (Tonnes)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={fuelConsumed}
                    onChange={(e) => setFuelConsumed(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs font-mono font-bold border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Site Supervisor</label>
                  <input
                    type="text"
                    value={supervisorName}
                    onChange={(e) => setSupervisorName(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Boiler Foreman</label>
                  <input
                    type="text"
                    value={foremanName}
                    onChange={(e) => setForemanName(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                  />
                </div>
              </div>

              {/* TWO MANDATORY PICTURES SELECTOR */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-extrabold text-gray-900 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-[#FF6600]" />
                  <span>Attach 2 Photographic Proofs (Meter Reading & Steam Output)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Photo 1: Meter Reading */}
                  <div className="p-3 rounded-xl border border-gray-200 bg-[#FAFBFD] space-y-2">
                    <label className="block text-xs font-bold text-gray-800">
                      1. Flow Meter Reading Photo
                    </label>
                    <div className="h-28 rounded-lg overflow-hidden border border-gray-200 bg-black/5 relative">
                      <img
                        src={meterPhoto}
                        alt="Meter Reading Proof"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-white text-[9px] font-bold">
                        Meter Verified
                      </span>
                    </div>
                    <select
                      value={meterPhoto}
                      onChange={(e) => setMeterPhoto(e.target.value)}
                      className="w-full px-2 py-1.5 text-[11px] border border-gray-200 rounded-lg bg-white"
                    >
                      {METER_IMAGE_PRESETS.map((p, idx) => (
                        <option key={idx} value={p.url}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Photo 2: Steam Discharge / Sight Glass */}
                  <div className="p-3 rounded-xl border border-gray-200 bg-[#FAFBFD] space-y-2">
                    <label className="block text-xs font-bold text-gray-800">
                      2. Boiler Steam Output / Flame Photo
                    </label>
                    <div className="h-28 rounded-lg overflow-hidden border border-gray-200 bg-black/5 relative">
                      <img
                        src={steamPhoto}
                        alt="Steam Output Proof"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-orange-600/90 text-white text-[9px] font-bold">
                        Steam Active
                      </span>
                    </div>
                    <select
                      value={steamPhoto}
                      onChange={(e) => setSteamPhoto(e.target.value)}
                      className="w-full px-2 py-1.5 text-[11px] border border-gray-200 rounded-lg bg-white"
                    >
                      {STEAM_IMAGE_PRESETS.map((p, idx) => (
                        <option key={idx} value={p.url}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Shift Notes & Operating Remarks
                </label>
                <input
                  type="text"
                  placeholder="e.g. Load stable at 8.4 Bar. Continuous blowdown at 2 turns nominal."
                  value={shiftNotes}
                  onChange={(e) => setShiftNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#FF6600] hover:bg-[#E65C00] rounded-xl shadow-sm transition-all"
                >
                  Confirm & Submit Shift Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FULL-SCREEN DUAL-PHOTO LIGHTBOX INSPECTION MODAL */}
      {lightboxRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#181B20] text-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl border border-gray-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-orange-500/20 text-[#FF6600]">
                  <Gauge className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-base flex items-center gap-2">
                    <span>{lightboxRecord.recordNumber}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                      Verified Dual Proof
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {lightboxRecord.boilerModel} · {lightboxRecord.siteName} ({lightboxRecord.date} - {lightboxRecord.shift})
                  </div>
                </div>
              </div>

              <button
                onClick={() => setLightboxRecord(null)}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Side-by-Side Dual Photo Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Photo 1: Meter Reading */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-300">Proof #1: Flow Meter Reading Dial</span>
                  <span className="font-mono text-[11px] text-[#FF6600] font-bold">
                    {lightboxRecord.steamGeneratedTons}t Produced
                  </span>
                </div>
                <div className="h-64 sm:h-80 rounded-xl overflow-hidden border border-gray-700 bg-black relative">
                  <img
                    src={lightboxRecord.meterPhotoUrl}
                    alt="Meter Proof"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 right-2 p-2 rounded-lg bg-black/75 backdrop-blur-sm text-[11px] font-mono flex items-center justify-between">
                    <span>Meter: {lightboxRecord.meterReadingInitial} &rarr; {lightboxRecord.meterReadingFinal}</span>
                    <span className="text-emerald-400 font-bold">{lightboxRecord.steamPressureBar} Bar</span>
                  </div>
                </div>
              </div>

              {/* Photo 2: Steam Discharge / Sight Glass */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-300">Proof #2: Steam Output & Chamber</span>
                  <span className="font-mono text-[11px] text-orange-400 font-bold">
                    {lightboxRecord.steamTemperatureC}°C Header
                  </span>
                </div>
                <div className="h-64 sm:h-80 rounded-xl overflow-hidden border border-gray-700 bg-black relative">
                  <img
                    src={lightboxRecord.steamPhotoUrl}
                    alt="Steam Proof"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 right-2 p-2 rounded-lg bg-black/75 backdrop-blur-sm text-[11px] font-mono flex items-center justify-between">
                    <span>Fuel: {lightboxRecord.fuelConsumedTons}t</span>
                    <span className="text-orange-400 font-bold">{lightboxRecord.fuelType}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification Sign-offs & Notes */}
            <div className="pt-3 border-t border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-400">
              <div className="space-y-0.5">
                <div>
                  Signed by Supervisor: <span className="font-bold text-white">{lightboxRecord.supervisorName}</span> | Foreman: <span className="font-bold text-white">{lightboxRecord.foremanName}</span>
                </div>
                {lightboxRecord.notes && (
                  <div className="italic text-gray-500">
                    &ldquo;{lightboxRecord.notes}&rdquo;
                  </div>
                )}
              </div>

              <button
                onClick={() => setLightboxRecord(null)}
                className="px-4 py-2 text-xs font-bold text-white bg-[#FF6600] hover:bg-[#E65C00] rounded-xl transition-all self-end sm:self-center"
              >
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
