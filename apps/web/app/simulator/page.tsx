"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  DollarSign,
  Fuel,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Flame,
  MapPin,
  RefreshCw,
  Send,
  Zap,
  Truck,
  Gauge,
  Boxes,
  Camera,
  Scale,
  Clock,
  User,
  ShieldCheck,
  ChevronRight,
  AlertTriangle,
  FileText,
  Activity,
  Layers,
} from "lucide-react";
import {
  DemoStore,
  DemoBoiler,
  DemoExpense,
  DemoWorker,
  DemoSupplier,
  DemoFuelDispatch,
  DemoSteamRecord,
  DemoMonthEndReconciliation,
} from "../demo-store";

export default function SimulatorPage() {
  const [boilers, setBoilers] = useState<DemoBoiler[]>([]);
  const [staff, setStaff] = useState<DemoWorker[]>([]);
  const [expenses, setExpenses] = useState<DemoExpense[]>([]);
  const [dispatches, setDispatches] = useState<DemoFuelDispatch[]>([]);
  const [steamRecords, setSteamRecords] = useState<DemoSteamRecord[]>([]);
  const [monthEndList, setMonthEndList] = useState<DemoMonthEndReconciliation[]>([]);
  const [suppliers, setSuppliers] = useState<DemoSupplier[]>([]);

  // Mobile App Navigation Tab
  const [mobileTab, setMobileTab] = useState<"EXPENSE" | "FUEL_ARRIVAL" | "STEAM_READING" | "FUEL_ENDING">("EXPENSE");

  // Common Phone Identity State
  const [selectedBoilerId, setSelectedBoilerId] = useState("blr-01");
  const [selectedWorkerId, setSelectedWorkerId] = useState("emp-01");
  const [submitting, setSubmitting] = useState(false);
  const [successNotif, setSuccessNotif] = useState("");

  // 1. Expense Form State
  const [expenseAmount, setExpenseAmount] = useState("12500");
  const [expenseCategory, setExpenseCategory] = useState<DemoExpense["category"]>("Biomass Fuel");
  const [expenseDesc, setExpenseDesc] = useState("Biomass pellet loading - 1.2 Ton batch");

  // 2. Fuel Arrival Form State
  const [fuelVendorId, setFuelVendorId] = useState("sup-01");
  const [fuelType, setFuelType] = useState("Grade-A Biomass Pellets");
  const [fuelVehicleNo, setFuelVehicleNo] = useState("LES-9921 (Hino 500)");
  const [fuelDriverName, setFuelDriverName] = useState("Rasheed Ahmed");
  const [fuelDriverPhone, setFuelDriverPhone] = useState("+92 300 7861122");
  const [fuelDispatchedTons, setFuelDispatchedTons] = useState("30.0");
  const [fuelReceivedTons, setFuelReceivedTons] = useState("29.8");
  const [fuelRatePerTon, setFuelRatePerTon] = useState("28500");
  const [fuelMoisture, setFuelMoisture] = useState("8.2");

  // 3. Steam Reading Form State
  const [steamShift, setSteamShift] = useState<DemoSteamRecord["shift"]>("Morning (06:00 - 14:00)");
  const [steamMeterInitial, setSteamMeterInitial] = useState("12450.0");
  const [steamMeterFinal, setSteamMeterFinal] = useState("12574.5");
  const [steamPressure, setSteamPressure] = useState("10.5");
  const [steamTemp, setSteamTemp] = useState("185");
  const [steamFuelBurned, setSteamFuelBurned] = useState("21.4");
  const [steamMeterPhoto, setSteamMeterPhoto] = useState("https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80");
  const [steamHeaderPhoto, setSteamHeaderPhoto] = useState("https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80");

  // 4. Month-End Fuel Ending Form State
  const [endingFuelType, setEndingFuelType] = useState("Grade-A Biomass Pellets");
  const [endingOpeningStock, setEndingOpeningStock] = useState("45.0");
  const [endingReceivedStock, setEndingReceivedStock] = useState("62.5");
  const [endingConsumedStock, setEndingConsumedStock] = useState("58.0");
  const [endingPhysicalDip, setEndingPhysicalDip] = useState("48.9");
  const [endingVarianceReason, setEndingVarianceReason] = useState("Normal weighbridge moisture loss & handling dust factor (<1.5%)");

  const refresh = () => {
    setBoilers(DemoStore.getBoilers());
    setStaff(DemoStore.getStaff());
    setExpenses(DemoStore.getExpenses());
    setDispatches(DemoStore.getFuelDispatches());
    setSteamRecords(DemoStore.getSteamRecords());
    setMonthEndList(DemoStore.getMonthEndReconciliations());
    setSuppliers(DemoStore.getSuppliers());
  };

  useEffect(() => {
    refresh();
    const unsub = DemoStore.subscribe(refresh);
    return () => unsub();
  }, []);

  const activeBoiler = boilers.find((b) => b.id === selectedBoilerId) || boilers[0];
  const activeWorker = staff.find((s) => s.id === selectedWorkerId) || staff[0];

  const triggerNotification = (msg: string) => {
    setSuccessNotif(msg);
    setTimeout(() => setSuccessNotif(""), 4000);
  };

  // Submissions
  const handleSubmitExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBoiler) return;
    setSubmitting(true);

    const amountNum = parseFloat(expenseAmount) || 0;
    setTimeout(() => {
      DemoStore.addExpense({
        boilerId: activeBoiler.id,
        boilerModel: activeBoiler.model,
        siteName: activeBoiler.siteName,
        amount: amountNum,
        category: expenseCategory,
        description: expenseDesc || `${expenseCategory} replenishment`,
        loggedBy: activeWorker ? activeWorker.name : "Liam Harper",
      });
      setSubmitting(false);
      triggerNotification("Expense logged! Recalculated daily operating cost in PKR.");
    }, 250);
  };

  const handleSubmitFuelArrival = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBoiler) return;
    setSubmitting(true);

    const dispT = parseFloat(fuelDispatchedTons) || 0;
    const recvT = parseFloat(fuelReceivedTons) || 0;
    const rate = parseFloat(fuelRatePerTon) || 28500;
    const diffT = Number((recvT - dispT).toFixed(2));
    const diffPct = dispT > 0 ? Number(((diffT / dispT) * 100).toFixed(1)) : 0;
    const selectedVendor = suppliers.find((s) => s.id === fuelVendorId);

    setTimeout(() => {
      DemoStore.addFuelDispatch({
        vendorId: fuelVendorId,
        vendorName: selectedVendor ? selectedVendor.name : "Punjab Agro Biomass Energy Pvt Ltd",
        fuelType: fuelType,
        targetSite: activeBoiler.siteName,
        boilerId: activeBoiler.id,
        boilerModel: activeBoiler.model,
        vehicleNo: fuelVehicleNo,
        driverName: fuelDriverName,
        driverPhone: fuelDriverPhone,
        dispatchedTons: dispT,
        receivedTons: recvT,
        varianceTons: diffT,
        variancePct: diffPct,
        ratePerTon: rate,
        totalCostPkr: Math.round(recvT * rate),
        dispatchDate: new Date().toISOString().slice(0, 10),
        deliveryDate: new Date().toISOString().slice(0, 10),
        status: Math.abs(diffPct) > 2.0 ? "Shortfall Under Dispute" : "Delivered & Verified",
        weighbridgeSlipPhotoUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80",
        moisturePct: parseFloat(fuelMoisture) || 8.0,
        gcvKcalPerKg: 4250,
      });

      // Also log stock movement to warehouse
      DemoStore.recordStockIn({
        itemId: "inv-01",
        quantity: recvT,
        reference: fuelVehicleNo,
        vendorName: selectedVendor ? selectedVendor.name : "Punjab Agro Biomass",
        siteName: activeBoiler.siteName,
        performedBy: activeWorker ? activeWorker.name : "Site Supervisor",
        notes: `Weighbridge intake verified. Vehicle ${fuelVehicleNo}`,
      });

      setSubmitting(false);
      triggerNotification(`Fuel truck delivery of ${recvT}t logged & stock intake updated!`);
    }, 250);
  };

  const handleSubmitSteamReading = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBoiler) return;
    setSubmitting(true);

    const initM = parseFloat(steamMeterInitial) || 0;
    const finalM = parseFloat(steamMeterFinal) || 0;
    const deltaTons = Math.max(0, Number((finalM - initM).toFixed(1)));
    const fuelBurn = parseFloat(steamFuelBurned) || 0;

    setTimeout(() => {
      DemoStore.addSteamRecord({
        date: new Date().toISOString().slice(0, 10),
        shift: steamShift,
        boilerId: activeBoiler.id,
        boilerModel: activeBoiler.model,
        siteName: activeBoiler.siteName,
        meterReadingInitial: initM,
        meterReadingFinal: finalM,
        steamGeneratedTons: deltaTons,
        steamPressureBar: parseFloat(steamPressure) || 10.5,
        steamTemperatureC: parseFloat(steamTemp) || 185,
        fuelConsumedTons: fuelBurn,
        fuelType: "Grade-A Biomass Pellets",
        meterPhotoUrl: steamMeterPhoto,
        steamPhotoUrl: steamHeaderPhoto,
        supervisorName: "Tariq Mahmood",
        foremanName: activeWorker ? activeWorker.name : "Mian Rashid",
        notes: `Shift flow delta: ${deltaTons}t steam logged with dual photo proof`,
      });

      setSubmitting(false);
      triggerNotification(`Steam production of ${deltaTons}t logged with dial & header proofs!`);
    }, 250);
  };

  const handleSubmitFuelEnding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBoiler) return;
    setSubmitting(true);

    const openT = parseFloat(endingOpeningStock) || 0;
    const recvT = parseFloat(endingReceivedStock) || 0;
    const burnT = parseFloat(endingConsumedStock) || 0;
    const bookClosing = Number((openT + recvT - burnT).toFixed(1));
    const physicalDip = parseFloat(endingPhysicalDip) || bookClosing;
    const varQty = Number(((physicalDip - bookClosing) * 1000).toFixed(0)); // in kg
    const varPct = bookClosing > 0 ? Number(((varQty / (bookClosing * 1000)) * 100).toFixed(1)) : 0;

    setTimeout(() => {
      DemoStore.addMonthEndReconciliation({
        month: "October 2026",
        date: new Date().toISOString().slice(0, 10),
        siteName: activeBoiler.siteName,
        boilerModel: activeBoiler.model,
        fuelType: endingFuelType,
        unit: "Tonnes",
        openingStock: openT,
        receivedStock: recvT,
        consumedStock: burnT,
        bookClosingStock: bookClosing,
        physicalDipStock: physicalDip,
        varianceQuantity: varQty,
        variancePercentage: varPct,
        varianceReason: endingVarianceReason,
        supervisorName: "Tariq Mahmood",
        foremanName: activeWorker ? activeWorker.name : "Mian Rashid",
        status: Math.abs(varPct) > 2.0 ? "Discrepancy Under Audit" : "Reconciled",
      });

      setSubmitting(false);
      triggerNotification(`Fuel ending dip of ${physicalDip}t verified! Book variance: ${varQty} kg`);
    }, 250);
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-[#FF6600] border border-orange-200">
              <Zap className="w-3 h-3" />
              Interactive Field App Simulator
            </span>
            <span className="text-xs text-gray-400 font-mono">Live bi-directional sync</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight font-[family-name:var(--font-display)]">
            Field Employee Mobile Simulator
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Test on-site operator workflows: log daily running expenses, fuel arrivals, steam meter flow, and month-end silo endings.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#181B20] hover:bg-black text-white text-xs font-bold rounded-xl transition-all self-start sm:self-auto shadow-xs"
        >
          <span>View on Main Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Simulator Workspace: Phone on Left, Real-time Dashboard Sync on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT / CENTER: Smartphone Mockup (Employee Portal) */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="w-full max-w-[400px] bg-black rounded-[48px] p-3.5 shadow-2xl ring-1 ring-gray-900/10">
            {/* Phone Screen Shell */}
            <div className="bg-[#F8F9FB] rounded-[40px] overflow-hidden border border-gray-800 flex flex-col min-h-[720px] max-h-[820px]">
              {/* Phone Status Bar */}
              <div className="bg-white px-6 pt-3 pb-2 flex items-center justify-between text-[11px] font-semibold text-gray-900 border-b border-gray-100 shrink-0">
                <span>9:41</span>
                {/* Dynamic island notch */}
                <div className="w-20 h-4 bg-black rounded-full" />
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] text-gray-500 font-bold">5G</span>
                </div>
              </div>

              {/* Mobile App Header */}
              <div className="bg-white px-5 py-3 border-b border-gray-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#FF6600] flex items-center justify-center text-white font-bold text-xs shadow-xs">
                    <Flame className="w-4 h-4 fill-white" />
                  </div>
                  <div>
                    <span className="font-extrabold text-xs text-gray-900 block leading-tight">
                      STOKER FIELD OPS
                    </span>
                    <span className="text-[10px] text-[#FF6600] font-semibold">
                      Mobile Operator Portal
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full text-[10px] font-bold border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>On Duty</span>
                </div>
              </div>

              {/* Mobile Task Navigator (4 Tab Pills) */}
              <div className="bg-gray-100/90 p-1.5 border-b border-gray-200 flex items-center gap-1 overflow-x-auto shrink-0">
                <button
                  type="button"
                  onClick={() => setMobileTab("EXPENSE")}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-[10px] font-bold whitespace-nowrap transition-all flex items-center justify-center gap-1 ${
                    mobileTab === "EXPENSE"
                      ? "bg-white text-gray-900 shadow-xs"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  <DollarSign className="w-3 h-3 text-[#FF6600]" />
                  <span>Expense</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMobileTab("FUEL_ARRIVAL")}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-[10px] font-bold whitespace-nowrap transition-all flex items-center justify-center gap-1 ${
                    mobileTab === "FUEL_ARRIVAL"
                      ? "bg-white text-gray-900 shadow-xs"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  <Truck className="w-3 h-3 text-blue-600" />
                  <span>Fuel Intake</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMobileTab("STEAM_READING")}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-[10px] font-bold whitespace-nowrap transition-all flex items-center justify-center gap-1 ${
                    mobileTab === "STEAM_READING"
                      ? "bg-white text-gray-900 shadow-xs"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  <Gauge className="w-3 h-3 text-purple-600" />
                  <span>Steam Log</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMobileTab("FUEL_ENDING")}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-[10px] font-bold whitespace-nowrap transition-all flex items-center justify-center gap-1 ${
                    mobileTab === "FUEL_ENDING"
                      ? "bg-white text-gray-900 shadow-xs"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  <Boxes className="w-3 h-3 text-emerald-600" />
                  <span>Fuel Ending</span>
                </button>
              </div>

              {/* Mobile App Scrollable Content */}
              <div className="p-4 space-y-3.5 overflow-y-auto flex-1 text-xs">
                {/* Operator & Target Boiler Card */}
                <div className="bg-white p-3 rounded-2xl border border-gray-200/80 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={activeWorker?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                        alt="Operator"
                        className="w-7 h-7 rounded-full object-cover ring-2 ring-orange-500/20"
                      />
                      <div>
                        <span className="font-bold text-gray-900 block text-xs leading-tight">
                          {activeWorker?.name || "Tariq Mahmood"}
                        </span>
                        <span className="text-[9px] text-gray-400 font-medium">
                          {activeWorker?.role || "Lead Boiler Operator"}
                        </span>
                      </div>
                    </div>

                    <select
                      value={selectedWorkerId}
                      onChange={(e) => setSelectedWorkerId(e.target.value)}
                      className="text-[10px] bg-gray-100 text-gray-700 font-semibold py-1 px-2 rounded-lg border-none"
                    >
                      {staff.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1 truncate max-w-[210px]">
                      <MapPin className="w-3 h-3 text-[#FF6600] shrink-0" />
                      <span className="truncate font-bold text-gray-800">{activeBoiler?.siteName}</span>
                    </div>

                    <select
                      value={selectedBoilerId}
                      onChange={(e) => setSelectedBoilerId(e.target.value)}
                      className="text-[10px] font-bold text-[#FF6600] bg-orange-50 px-2 py-0.5 rounded-lg border border-orange-200"
                    >
                      {boilers.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.model}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Instant Success Feedback Banner */}
                {successNotif && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-emerald-800 text-xs font-bold animate-in fade-in duration-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{successNotif}</span>
                  </div>
                )}

                {/* ========================================================================= */}
                {/* TAB 1: LOG RUNNING EXPENSE */}
                {/* ========================================================================= */}
                {mobileTab === "EXPENSE" && (
                  <form
                    onSubmit={handleSubmitExpense}
                    className="bg-white p-4 rounded-2xl border border-gray-200/90 shadow-2xs space-y-3"
                  >
                    <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
                      <span className="font-bold text-gray-900 text-xs flex items-center gap-1.5">
                        <DollarSign className="w-4 h-4 text-[#FF6600]" />
                        Log Boiler Running Expense
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium font-mono">PKR / Rs.</span>
                    </div>

                    {/* Quick Presets */}
                    <div>
                      <span className="text-[10px] font-semibold text-gray-400 block mb-1">
                        Quick Preset Buttons:
                      </span>
                      <div className="grid grid-cols-3 gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setExpenseAmount("25000");
                            setExpenseDesc("Biomass pellet replenishment 1.5t");
                            setExpenseCategory("Biomass Fuel");
                          }}
                          className="py-1 px-1.5 bg-orange-50 text-[#FF6600] hover:bg-orange-100 rounded-lg text-[10px] font-bold border border-orange-200 text-center"
                        >
                          +Rs. 25k Fuel
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setExpenseAmount("7500");
                            setExpenseDesc("Descaling softening chemicals feed");
                            setExpenseCategory("Water Treatment");
                          }}
                          className="py-1 px-1.5 bg-sky-50 text-sky-600 hover:bg-sky-100 rounded-lg text-[10px] font-bold border border-sky-200 text-center"
                        >
                          +Rs. 7.5k Water
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setExpenseAmount("4500");
                            setExpenseDesc("Shift crew food & tea stipend");
                            setExpenseCategory("Crew Allowance");
                          }}
                          className="py-1 px-1.5 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-lg text-[10px] font-bold border border-purple-200 text-center"
                        >
                          +Rs. 4.5k Crew
                        </button>
                      </div>
                    </div>

                    {/* Amount Input */}
                    <div>
                      <label className="text-[11px] font-semibold text-gray-600 block mb-1">
                        Amount (PKR / Rs.)
                      </label>
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-bold text-xs text-gray-400">
                          Rs.
                        </span>
                        <input
                          type="number"
                          step="1"
                          required
                          value={expenseAmount}
                          onChange={(e) => setExpenseAmount(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-[#F3F4F7] font-bold text-sm text-gray-900 rounded-xl border border-transparent focus:border-[#FF6600] focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Category */}
                    <div>
                      <label className="text-[11px] font-semibold text-gray-600 block mb-1">
                        Expense Category
                      </label>
                      <select
                        value={expenseCategory}
                        onChange={(e) => setExpenseCategory(e.target.value as DemoExpense["category"])}
                        className="w-full p-2 bg-[#F3F4F7] border border-transparent rounded-xl text-xs font-semibold text-gray-800 focus:border-[#FF6600] focus:bg-white focus:outline-none"
                      >
                        <option value="Biomass Fuel">Biomass Fuel / Briquettes</option>
                        <option value="Water Treatment">Water Treatment & Chemicals</option>
                        <option value="Spare Parts">Spare Parts & Gaskets</option>
                        <option value="Crew Allowance">Crew Stipend & Overtime</option>
                        <option value="Maintenance">Routine Lubrication & Service</option>
                      </select>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="text-[11px] font-semibold text-gray-600 block mb-1">
                        Description / Vendor Note
                      </label>
                      <input
                        type="text"
                        required
                        value={expenseDesc}
                        onChange={(e) => setExpenseDesc(e.target.value)}
                        className="w-full p-2 bg-[#F3F4F7] border border-transparent rounded-xl text-xs text-gray-900 focus:border-[#FF6600] focus:bg-white focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-2.5 bg-[#FF6600] hover:bg-[#e05a00] text-white font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{submitting ? "Transmitting..." : "Submit Running Expense"}</span>
                    </button>
                  </form>
                )}

                {/* ========================================================================= */}
                {/* TAB 2: LOG FUEL ARRIVAL (WEIGHBRIDGE INTAKE) */}
                {/* ========================================================================= */}
                {mobileTab === "FUEL_ARRIVAL" && (
                  <form
                    onSubmit={handleSubmitFuelArrival}
                    className="bg-white p-4 rounded-2xl border border-gray-200/90 shadow-2xs space-y-3"
                  >
                    <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
                      <span className="font-bold text-gray-900 text-xs flex items-center gap-1.5">
                        <Truck className="w-4 h-4 text-blue-600" />
                        Log Fuel Truck Arrival
                      </span>
                      <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Weighbridge Link
                      </span>
                    </div>

                    {/* Supplier */}
                    <div>
                      <label className="text-[11px] font-semibold text-gray-600 block mb-1">
                        Contracted Fuel Vendor
                      </label>
                      <select
                        value={fuelVendorId}
                        onChange={(e) => {
                          setFuelVendorId(e.target.value);
                          const sup = suppliers.find((s) => s.id === e.target.value);
                          if (sup) setFuelType(sup.category);
                        }}
                        className="w-full p-2 bg-[#F3F4F7] rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#FF6600]"
                      >
                        {suppliers.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} ({s.category})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Vehicle & Driver */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-semibold text-gray-500 block mb-0.5">
                          Truck Plate #
                        </label>
                        <input
                          type="text"
                          value={fuelVehicleNo}
                          onChange={(e) => setFuelVehicleNo(e.target.value)}
                          required
                          className="w-full p-1.5 bg-[#F3F4F7] rounded-lg text-xs font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-gray-500 block mb-0.5">
                          Driver Name
                        </label>
                        <input
                          type="text"
                          value={fuelDriverName}
                          onChange={(e) => setFuelDriverName(e.target.value)}
                          required
                          className="w-full p-1.5 bg-[#F3F4F7] rounded-lg text-xs font-semibold"
                        />
                      </div>
                    </div>

                    {/* Dispatched vs Weighbridge Received Weight */}
                    <div className="grid grid-cols-2 gap-2 p-2.5 bg-gray-50 rounded-xl border border-gray-200">
                      <div>
                        <label className="text-[10px] font-bold text-gray-600 block mb-0.5">
                          Dispatch Tonnage (t)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={fuelDispatchedTons}
                          onChange={(e) => setFuelDispatchedTons(e.target.value)}
                          required
                          className="w-full p-1.5 bg-white border border-gray-200 rounded-lg text-xs font-mono font-bold"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-blue-700 block mb-0.5">
                          Weighbridge Gross-Tare (t)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={fuelReceivedTons}
                          onChange={(e) => setFuelReceivedTons(e.target.value)}
                          required
                          className="w-full p-1.5 bg-white border border-blue-300 rounded-lg text-xs font-mono font-extrabold text-blue-900"
                        />
                      </div>
                    </div>

                    {/* Calculated Variance */}
                    <div className="flex items-center justify-between text-[11px] px-1 font-mono">
                      <span className="text-gray-500">Intake Variance:</span>
                      <span className={`font-bold ${
                        (parseFloat(fuelReceivedTons) - parseFloat(fuelDispatchedTons)) < -0.6
                          ? "text-rose-600"
                          : "text-emerald-600"
                      }`}>
                        {(parseFloat(fuelReceivedTons) - parseFloat(fuelDispatchedTons)).toFixed(2)} Tonnes (
                        {(((parseFloat(fuelReceivedTons) - parseFloat(fuelDispatchedTons)) / (parseFloat(fuelDispatchedTons) || 1)) * 100).toFixed(1)}%)
                      </span>
                    </div>

                    {/* Landed Rate */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-semibold text-gray-500 block mb-0.5">
                          Rate (PKR / Ton)
                        </label>
                        <input
                          type="number"
                          value={fuelRatePerTon}
                          onChange={(e) => setFuelRatePerTon(e.target.value)}
                          className="w-full p-1.5 bg-[#F3F4F7] rounded-lg text-xs font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-gray-500 block mb-0.5">
                          Moisture Content (%)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={fuelMoisture}
                          onChange={(e) => setFuelMoisture(e.target.value)}
                          className="w-full p-1.5 bg-[#F3F4F7] rounded-lg text-xs font-mono font-bold"
                        />
                      </div>
                    </div>

                    {/* Proof Checklist */}
                    <div className="p-2 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1 text-[10px] text-blue-900">
                      <div className="font-bold flex items-center gap-1">
                        <Camera className="w-3 h-3 text-blue-600" />
                        <span>Tamper-Proof Geofence Attachments:</span>
                      </div>
                      <div className="flex items-center justify-between text-blue-800">
                        <span>✓ Weighbridge Gross/Tare Stamped Slip</span>
                        <span className="font-mono">SHA-256</span>
                      </div>
                      <div className="flex items-center justify-between text-blue-800">
                        <span>✓ Truck Plate & Cargo Photo</span>
                        <span className="font-mono">GPS Verified</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
                    >
                      <Scale className="w-3.5 h-3.5" />
                      <span>{submitting ? "Verifying..." : "Confirm Fuel Arrival Intake"}</span>
                    </button>
                  </form>
                )}

                {/* ========================================================================= */}
                {/* TAB 3: LOG STEAM METER READING */}
                {/* ========================================================================= */}
                {mobileTab === "STEAM_READING" && (
                  <form
                    onSubmit={handleSubmitSteamReading}
                    className="bg-white p-4 rounded-2xl border border-gray-200/90 shadow-2xs space-y-3"
                  >
                    <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
                      <span className="font-bold text-gray-900 text-xs flex items-center gap-1.5">
                        <Gauge className="w-4 h-4 text-purple-600" />
                        Log Shift Steam Production
                      </span>
                      <span className="text-[10px] text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                        Dual Photo Proof
                      </span>
                    </div>

                    {/* Shift */}
                    <div>
                      <label className="text-[11px] font-semibold text-gray-600 block mb-1">
                        Operating Shift
                      </label>
                      <select
                        value={steamShift}
                        onChange={(e) => setSteamShift(e.target.value as DemoSteamRecord["shift"])}
                        className="w-full p-2 bg-[#F3F4F7] rounded-xl text-xs font-semibold text-gray-900 focus:outline-none"
                      >
                        <option value="Morning (06:00 - 14:00)">Morning (06:00 - 14:00)</option>
                        <option value="Evening (14:00 - 22:00)">Evening (14:00 - 22:00)</option>
                        <option value="Night (22:00 - 06:00)">Night (22:00 - 06:00)</option>
                      </select>
                    </div>

                    {/* Flow Meter Readings */}
                    <div className="grid grid-cols-2 gap-2 p-2.5 bg-purple-50/50 rounded-xl border border-purple-200">
                      <div>
                        <label className="text-[10px] font-bold text-gray-600 block mb-0.5">
                          Initial Meter Reading
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={steamMeterInitial}
                          onChange={(e) => setSteamMeterInitial(e.target.value)}
                          required
                          className="w-full p-1.5 bg-white border border-gray-200 rounded-lg text-xs font-mono font-bold"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-purple-800 block mb-0.5">
                          Final Meter Reading
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={steamMeterFinal}
                          onChange={(e) => setSteamMeterFinal(e.target.value)}
                          required
                          className="w-full p-1.5 bg-white border border-purple-300 rounded-lg text-xs font-mono font-extrabold text-purple-900"
                        />
                      </div>
                    </div>

                    {/* Net Output & Fuel Consumed */}
                    <div className="grid grid-cols-2 gap-2 font-mono">
                      <div className="p-2 bg-gray-50 rounded-xl border border-gray-200">
                        <span className="text-[9px] font-sans text-gray-400 block font-bold">NET STEAM GENERATED</span>
                        <span className="font-black text-sm text-purple-700">
                          {Math.max(0, Number((parseFloat(steamMeterFinal) - parseFloat(steamMeterInitial)).toFixed(1)))} t
                        </span>
                      </div>

                      <div className="p-2 bg-gray-50 rounded-xl border border-gray-200">
                        <span className="text-[9px] font-sans text-gray-400 block font-bold">FUEL BURNED IN SHIFT</span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <input
                            type="number"
                            step="0.1"
                            value={steamFuelBurned}
                            onChange={(e) => setSteamFuelBurned(e.target.value)}
                            className="w-16 p-0.5 text-xs font-mono font-black border border-gray-200 rounded"
                          />
                          <span className="text-xs text-gray-500 font-bold">t</span>
                        </div>
                      </div>
                    </div>

                    {/* Operational Pressure & Temp */}
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div>
                        <label className="font-semibold text-gray-500 block mb-0.5">Steam Pressure (Bar)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={steamPressure}
                          onChange={(e) => setSteamPressure(e.target.value)}
                          className="w-full p-1.5 bg-[#F3F4F7] rounded-lg text-xs font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-gray-500 block mb-0.5">Steam Temperature (°C)</label>
                        <input
                          type="number"
                          value={steamTemp}
                          onChange={(e) => setSteamTemp(e.target.value)}
                          className="w-full p-1.5 bg-[#F3F4F7] rounded-lg text-xs font-mono font-bold"
                        />
                      </div>
                    </div>

                    {/* 2 Required Photo Proofs Badges */}
                    <div className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl space-y-1.5 text-[10px]">
                      <div className="font-bold text-gray-700 flex items-center justify-between">
                        <span>2 Mandatory Photo Proofs:</span>
                        <span className="text-emerald-600 font-mono">Captured ✓</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-white p-1.5 rounded-lg border border-gray-200 flex items-center gap-1.5">
                          <Camera className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                          <span className="truncate font-semibold text-gray-800">1. Meter Dial Photo</span>
                        </div>
                        <div className="flex-1 bg-white p-1.5 rounded-lg border border-gray-200 flex items-center gap-1.5">
                          <Camera className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                          <span className="truncate font-semibold text-gray-800">2. Flame/Steam Photo</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
                    >
                      <Gauge className="w-3.5 h-3.5" />
                      <span>{submitting ? "Uploading..." : "Save Shift Steam Record"}</span>
                    </button>
                  </form>
                )}

                {/* ========================================================================= */}
                {/* TAB 4: LOG FUEL ENDING (SILO DIP MEASUREMENT) */}
                {/* ========================================================================= */}
                {mobileTab === "FUEL_ENDING" && (
                  <form
                    onSubmit={handleSubmitFuelEnding}
                    className="bg-white p-4 rounded-2xl border border-gray-200/90 shadow-2xs space-y-3"
                  >
                    <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
                      <span className="font-bold text-gray-900 text-xs flex items-center gap-1.5">
                        <Boxes className="w-4 h-4 text-emerald-600" />
                        Month-End Fuel Silo Dip
                      </span>
                      <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Formula Audit
                      </span>
                    </div>

                    {/* Fuel Type */}
                    <div>
                      <label className="text-[11px] font-semibold text-gray-600 block mb-1">
                        Silo Fuel Material
                      </label>
                      <select
                        value={endingFuelType}
                        onChange={(e) => setEndingFuelType(e.target.value)}
                        className="w-full p-2 bg-[#F3F4F7] rounded-xl text-xs font-semibold text-gray-900 focus:outline-none"
                      >
                        <option value="Grade-A Biomass Pellets">Grade-A Biomass Pellets (Silo Hopper 1)</option>
                        <option value="Cotton Stalk Briquettes">Cotton Stalk Briquettes (Bunker B)</option>
                        <option value="Wheat Straw & Husk Pellets">Wheat Straw & Husk Pellets (Depot 3)</option>
                        <option value="Bio-Coal 70/30 Fuel Blend">Bio-Coal 70/30 Fuel Blend (Central Silo)</option>
                      </select>
                    </div>

                    {/* Reconciliation Math Grid */}
                    <div className="grid grid-cols-3 gap-1.5 p-2 bg-gray-50 rounded-xl border border-gray-200 text-center font-mono text-[10px]">
                      <div>
                        <span className="text-gray-400 block font-sans">Opening</span>
                        <input
                          type="number"
                          step="0.1"
                          value={endingOpeningStock}
                          onChange={(e) => setEndingOpeningStock(e.target.value)}
                          className="w-full p-1 bg-white border border-gray-200 rounded font-bold text-center mt-0.5"
                        />
                      </div>
                      <div>
                        <span className="text-emerald-600 block font-sans">+Received</span>
                        <input
                          type="number"
                          step="0.1"
                          value={endingReceivedStock}
                          onChange={(e) => setEndingReceivedStock(e.target.value)}
                          className="w-full p-1 bg-white border border-emerald-200 rounded font-bold text-center mt-0.5"
                        />
                      </div>
                      <div>
                        <span className="text-orange-600 block font-sans">-Burned</span>
                        <input
                          type="number"
                          step="0.1"
                          value={endingConsumedStock}
                          onChange={(e) => setEndingConsumedStock(e.target.value)}
                          className="w-full p-1 bg-white border border-orange-200 rounded font-bold text-center mt-0.5"
                        />
                      </div>
                    </div>

                    {/* Book Ending Stock vs Physical Silo Dip */}
                    <div className="grid grid-cols-2 gap-2 p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-200 font-mono text-xs">
                      <div>
                        <span className="text-[10px] font-sans font-bold text-gray-500 block">BOOK CLOSING</span>
                        <span className="text-sm font-black text-gray-900 mt-0.5 block">
                          {(parseFloat(endingOpeningStock) + parseFloat(endingReceivedStock) - parseFloat(endingConsumedStock)).toFixed(1)} t
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-sans font-bold text-emerald-800 block">PHYSICAL SILO DIP</span>
                        <input
                          type="number"
                          step="0.1"
                          value={endingPhysicalDip}
                          onChange={(e) => setEndingPhysicalDip(e.target.value)}
                          required
                          className="w-full p-1.5 bg-white border border-emerald-400 rounded-lg text-xs font-black text-emerald-900 mt-0.5"
                        />
                      </div>
                    </div>

                    {/* Variance Output */}
                    <div className="flex items-center justify-between text-[11px] px-1 font-mono">
                      <span className="text-gray-500">Silo Dip Variance:</span>
                      <span className="font-bold text-emerald-700">
                        {((parseFloat(endingPhysicalDip) - (parseFloat(endingOpeningStock) + parseFloat(endingReceivedStock) - parseFloat(endingConsumedStock))) * 1000).toFixed(0)} kg (
                        {(((parseFloat(endingPhysicalDip) - (parseFloat(endingOpeningStock) + parseFloat(endingReceivedStock) - parseFloat(endingConsumedStock))) / ((parseFloat(endingOpeningStock) + parseFloat(endingReceivedStock) - parseFloat(endingConsumedStock)) || 1)) * 100).toFixed(1)}%)
                      </span>
                    </div>

                    {/* Variance Note */}
                    <div>
                      <label className="text-[10px] font-semibold text-gray-500 block mb-0.5">
                        Auditor Sign-off Note
                      </label>
                      <input
                        type="text"
                        value={endingVarianceReason}
                        onChange={(e) => setEndingVarianceReason(e.target.value)}
                        className="w-full p-2 bg-[#F3F4F7] rounded-xl text-xs text-gray-900 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
                    >
                      <Boxes className="w-3.5 h-3.5" />
                      <span>{submitting ? "Signing..." : "Save Silo Ending Stock"}</span>
                    </button>
                  </form>
                )}

                {/* Bottom home indicator line */}
                <div className="pt-2 flex justify-center">
                  <div className="w-28 h-1 bg-gray-300 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT: Real-time Telemetry & Cloud Broadcast Preview */}
        {/* ========================================================================= */}
        <div className="lg:col-span-6 space-y-5">
          {/* Real-time Status Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-gray-900">
                    Live Cloud Sync Telemetry
                  </h3>
                  <span className="text-xs text-gray-400">
                    Zero latency, instant operational broadcast
                  </span>
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Connected</span>
              </span>
            </div>

            {/* Contextual Description based on Mobile Tab */}
            <div className="text-xs text-gray-600 leading-relaxed bg-gray-50/80 p-3.5 rounded-2xl border border-gray-200/70">
              {mobileTab === "EXPENSE" && (
                <p>
                  Logging a <strong>Running Expense</strong> on the mobile interface instantly recalculates today&apos;s operational running cost for <strong>{activeBoiler?.model}</strong> in Pakistani Rupees (PKR), automatically reflecting on the head office dashboard and in expense ledgers.
                </p>
              )}
              {mobileTab === "FUEL_ARRIVAL" && (
                <p>
                  Submitting a <strong>Fuel Truck Arrival</strong> logs gross/tare weighbridge tonnage from contracted Pakistani suppliers, verifies shortfall tolerance (&lt;2%), and increments central depot inventory immediately.
                </p>
              )}
              {mobileTab === "STEAM_READING" && (
                <p>
                  Logging <strong>Steam Meter Readings</strong> captures flow delta and attaches the <strong>2 required photographic proofs</strong> (Meter dial + Steam header/flame), immediately updating Daily/Weekly/Monthly steam generation charts.
                </p>
              )}
              {mobileTab === "FUEL_ENDING" && (
                <p>
                  Recording <strong>Fuel Ending Silo Dips</strong> executes the automated reconciliation: <em>Opening + Received - Burned = Book vs Physical Dip</em>, updating silo reserves and autonomy runway days.
                </p>
              )}
            </div>

            {/* Boiler Live Telemetry Stats Card */}
            {activeBoiler && (
              <div className="bg-[#F8F9FB] rounded-2xl p-4 border border-gray-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-12 bg-white rounded-xl border border-gray-200 p-1 flex items-center justify-center shrink-0">
                    <img
                      src={activeBoiler.image}
                      alt={activeBoiler.model}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-gray-900 block">
                      {activeBoiler.model}
                    </span>
                    <span className="text-[11px] text-gray-500 block">
                      {activeBoiler.siteName}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-gray-400 font-semibold block uppercase">
                    Daily Running Cost
                  </span>
                  <span className="text-lg font-extrabold text-[#FF6600]">
                    Rs. {activeBoiler.dailyRunningCost.toLocaleString("en-PK")}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Unified Recent Operational Activity Stream */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#FF6600]" />
                <h3 className="font-extrabold text-sm text-gray-900">
                  Live Operations Feed (All Modules)
                </h3>
              </div>
              <span className="text-xs text-gray-400 font-medium">
                Real-time updates
              </span>
            </div>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {/* Recent Dispatches */}
              {dispatches.slice(0, 2).map((disp) => (
                <div
                  key={disp.id}
                  className="p-3 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                      <Truck className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-gray-900 truncate">{disp.fuelType}</span>
                        <span className="text-[9px] bg-white px-1.5 py-0.2 rounded border border-blue-200 text-blue-700 font-bold shrink-0">
                          Fuel Intake
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-500 truncate block mt-0.5">
                        {disp.receivedTons}t from {disp.vendorName} ({disp.vehicleNo})
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-extrabold text-blue-900 block font-mono">
                      Rs. {disp.totalCostPkr.toLocaleString("en-PK")}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono block">
                      {disp.deliveryDate}
                    </span>
                  </div>
                </div>
              ))}

              {/* Recent Steam Records */}
              {steamRecords.slice(0, 2).map((stm) => (
                <div
                  key={stm.id}
                  className="p-3 bg-purple-50/50 rounded-2xl border border-purple-100 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs shrink-0">
                      <Gauge className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-gray-900 truncate">{stm.boilerModel}</span>
                        <span className="text-[9px] bg-white px-1.5 py-0.2 rounded border border-purple-200 text-purple-700 font-bold shrink-0">
                          Steam Log
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-500 truncate block mt-0.5">
                        {stm.steamGeneratedTons}t steam · {stm.shift.split(" ")[0]} Shift
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-extrabold text-purple-900 block font-mono">
                      {stm.steamPressureBar} Bar
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold block">
                      Dual Proofs ✓
                    </span>
                  </div>
                </div>
              ))}

              {/* Recent Expenses */}
              {expenses.slice(0, 2).map((exp, idx) => (
                <div
                  key={exp.id}
                  className="p-3 bg-orange-50/50 rounded-2xl border border-orange-100 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-orange-100 text-[#FF6600] flex items-center justify-center font-bold text-xs shrink-0">
                      <Fuel className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-gray-900 truncate">{exp.boilerModel}</span>
                        <span className="text-[9px] bg-white px-1.5 py-0.2 rounded border border-orange-200 text-[#FF6600] font-bold shrink-0">
                          {exp.category}
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-500 truncate block mt-0.5">
                        {exp.description} (by {exp.loggedBy})
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-extrabold text-gray-900 block font-mono">
                      Rs. {exp.amount.toLocaleString("en-PK")}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono block">
                      {idx === 0 ? "Just now" : exp.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
