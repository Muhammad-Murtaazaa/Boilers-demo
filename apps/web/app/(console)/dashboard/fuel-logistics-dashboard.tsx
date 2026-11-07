"use client";

import { useState, useEffect } from "react";
import {
  Truck,
  Building2,
  Boxes,
  TrendingUp,
  Flame,
  Scale,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  DollarSign,
  Fuel,
  MapPin,
  ChevronRight,
  User,
  ShieldCheck,
  Search,
  ExternalLink,
} from "lucide-react";
import {
  DemoStore,
  DemoSupplier,
  DemoFuelDispatch,
  DemoBoiler,
  DemoMonthEndReconciliation,
} from "../../demo-store";

export function FuelLogisticsDashboard() {
  const [suppliers, setSuppliers] = useState<DemoSupplier[]>([]);
  const [dispatches, setDispatches] = useState<DemoFuelDispatch[]>([]);
  const [boilers, setBoilers] = useState<DemoBoiler[]>([]);
  const [monthEndList, setMonthEndList] = useState<DemoMonthEndReconciliation[]>([]);
  const [selectedSiteFilter, setSelectedSiteFilter] = useState<string>("All");
  const [selectedVendorFilter, setSelectedVendorFilter] = useState<string>("All");

  const refreshData = () => {
    setSuppliers(DemoStore.getSuppliers());
    setDispatches(DemoStore.getFuelDispatches());
    setBoilers(DemoStore.getBoilers());
    setMonthEndList(DemoStore.getMonthEndReconciliations());
  };

  useEffect(() => {
    refreshData();
    const unsub = DemoStore.subscribe(refreshData);
    return () => unsub();
  }, []);

  // Filtered Dispatches
  const filteredDispatches = dispatches.filter((d) => {
    const matchesSite = selectedSiteFilter === "All" || d.targetSite.includes(selectedSiteFilter);
    const matchesVendor = selectedVendorFilter === "All" || d.vendorName === selectedVendorFilter;
    return matchesSite && matchesVendor;
  });

  // KPI Calculations
  const totalDispatchedTons = dispatches.reduce((acc, curr) => acc + curr.dispatchedTons, 0);
  const totalReceivedTons = dispatches.reduce((acc, curr) => acc + curr.receivedTons, 0);
  const totalFuelSpendPkr = dispatches.reduce((acc, curr) => acc + curr.totalCostPkr, 0);
  const totalVarianceTons = dispatches.reduce((acc, curr) => acc + curr.varianceTons, 0);
  const avgShortfallPct = totalDispatchedTons > 0 ? ((Math.abs(totalVarianceTons) / totalDispatchedTons) * 100).toFixed(2) : "0.00";

  // Total Month-End Closing Stock
  const totalClosingStockTons = monthEndList.reduce((acc, curr) => acc + curr.physicalDipStock, 0);
  const totalOpeningStockTons = monthEndList.reduce((acc, curr) => acc + curr.openingStock, 0);
  const totalBurnedTons = monthEndList.reduce((acc, curr) => acc + curr.consumedStock, 0);

  // Group Dispatches by Vendor
  const vendorBreakdown = suppliers.map((sup) => {
    const vendorDispatches = dispatches.filter((d) => d.vendorName === sup.name);
    const tons = vendorDispatches.reduce((s, d) => s + d.dispatchedTons, 0);
    const spend = vendorDispatches.reduce((s, d) => s + d.totalCostPkr, 0);
    const avgRate = tons > 0 ? Math.round(spend / tons) : 0;
    const sharePct = totalDispatchedTons > 0 ? ((tons / totalDispatchedTons) * 100).toFixed(1) : "0";
    return {
      supplier: sup,
      tons,
      spend,
      avgRate,
      sharePct,
      dispatchesCount: vendorDispatches.length,
    };
  });

  // Group Dispatches by Site
  const siteNames = [
    { name: "Riverside Mill (RVR-01)", boilerModel: "Thermax SteamMax 5T", supervisor: "Tariq Mahmood", foreman: "Mian Rashid", phone: "+92 300 8472911" },
    { name: "Faisalabad Weaving Complex (FSD-02)", boilerModel: "Volta Steam G-5000", supervisor: "Ali Asghar", foreman: "Haji Mohammad Rafiq", phone: "+92 321 6654321" },
    { name: "Highland Biofuels Plant (HLD-03)", boilerModel: "Babcock Wanson B-300", supervisor: "Shahid Latif", foreman: "Ustad Akram", phone: "+92 333 4455667" },
    { name: "Prime Cotton Spinning Mills (PCM-04)", boilerModel: "Cleaver-Brooks CB-200", supervisor: "Junaid Iqbal", foreman: "Babar Azam", phone: "+92 301 7788990" },
  ];

  const siteBreakdown = siteNames.map((site) => {
    const siteDispatches = dispatches.filter((d) => d.targetSite.includes(site.name.split(" ")[0] || ""));
    const dispatched = siteDispatches.reduce((s, d) => s + d.dispatchedTons, 0);
    const received = siteDispatches.reduce((s, d) => s + d.receivedTons, 0);
    const monthRecord = monthEndList.find((m) => m.siteName.includes(site.name.split(" ")[0] || ""));
    const currentStock = monthRecord ? monthRecord.physicalDipStock : 35.0;
    const burned = monthRecord ? monthRecord.consumedStock : (received * 0.92);
    const autonomyDays = (currentStock / 3.2).toFixed(1); // avg daily burn ~3.2t

    return {
      ...site,
      dispatched,
      received,
      burned: Math.round(burned),
      currentStock,
      autonomyDays,
      dispatchesCount: siteDispatches.length,
      primaryFuel: siteDispatches[0]?.fuelType || "Biomass Pellets",
    };
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Fuel Procured */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Total Fuel Sourced
            </div>
            <div className="text-2xl font-black text-gray-900 font-mono tracking-tight mt-1">
              {totalDispatchedTons.toFixed(1)} <span className="text-sm font-semibold text-gray-500">Tonnes</span>
            </div>
            <div className="text-[11px] font-mono text-emerald-700 font-bold mt-0.5">
              Rs. {totalFuelSpendPkr.toLocaleString("en-PK")} spent
            </div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF6600]">
            <Truck className="w-5 h-5" />
          </div>
        </div>

        {/* Total Fuel Dispatched to Sites */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Delivered to Sites
            </div>
            <div className="text-2xl font-black text-gray-900 font-mono tracking-tight mt-1">
              {totalReceivedTons.toFixed(1)} <span className="text-sm font-semibold text-gray-500">Tonnes</span>
            </div>
            <div className="text-[11px] text-gray-500 mt-0.5">
              Across 4 central site silo depots
            </div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        {/* Total Fuel Burned in Boilers */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Total Fuel Burned
            </div>
            <div className="text-2xl font-black text-gray-900 font-mono tracking-tight mt-1">
              {totalBurnedTons.toFixed(1)} <span className="text-sm font-semibold text-gray-500">Tonnes</span>
            </div>
            <div className="text-[11px] text-orange-600 font-bold mt-0.5 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" />
              <span>5.82 kg Steam / kg Fuel</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <Flame className="w-5 h-5" />
          </div>
        </div>

        {/* Month-Ending Silo Reserves */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Month-End Silo Reserves
            </div>
            <div className="text-2xl font-black text-gray-900 font-mono tracking-tight mt-1">
              {totalClosingStockTons.toFixed(1)} <span className="text-sm font-semibold text-gray-500">Tonnes</span>
            </div>
            <div className="text-[11px] text-emerald-700 font-bold mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>13.8 Days Autonomy Runway</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <Boxes className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* SECTION 1: FUEL BOUGHT BY VENDOR BREAKDOWN */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-orange-100 text-[#FF6600]">
                <Truck className="w-4 h-4" />
              </span>
              <h2 className="text-base font-extrabold text-gray-900">
                Fuel Purchased by Vendor (All Fuel Suppliers)
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Comprehensive breakdown of total biomass fuel bought from each contracted Pakistani supplier
            </p>
          </div>

          <span className="text-xs font-bold text-gray-400">
            {suppliers.length} Certified Biomass & Fuel Vendors
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vendorBreakdown.map((vb) => (
            <div
              key={vb.supplier.id}
              className="bg-gray-50/70 hover:bg-white rounded-2xl border border-gray-200/90 p-4 transition-all hover:shadow-md flex flex-col justify-between gap-3"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-orange-100 text-[#FF6600]">
                      {vb.supplier.code}
                    </span>
                    <h3 className="font-bold text-gray-900 text-sm mt-1 line-clamp-1">
                      {vb.supplier.name}
                    </h3>
                    <span className="text-[11px] font-semibold text-gray-500 block">
                      {vb.supplier.category}
                    </span>
                  </div>

                  <span className="font-bold text-xs text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 shrink-0">
                    ★ {vb.supplier.rating.toFixed(1)}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-gray-500">
                  <MapPin className="w-3 h-3 text-[#FF6600] shrink-0" />
                  <span className="truncate">{vb.supplier.address}, {vb.supplier.city}</span>
                </div>

                {/* Sourcing Stats */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200/60 font-mono text-xs">
                  <div className="bg-white p-2 rounded-xl border border-gray-100">
                    <span className="text-[10px] font-sans font-medium text-gray-400 block">Total Supplied</span>
                    <span className="font-black text-gray-900 text-sm">{vb.tons.toFixed(1)} t</span>
                  </div>

                  <div className="bg-white p-2 rounded-xl border border-gray-100">
                    <span className="text-[10px] font-sans font-medium text-gray-400 block">Total Spend</span>
                    <span className="font-black text-[#FF6600] text-xs">Rs. {vb.spend.toLocaleString("en-PK")}</span>
                  </div>
                </div>

                {/* Sourcing Share Bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[10px] text-gray-500 font-semibold">
                    <span>Share of Total Fleet Fuel:</span>
                    <span className="font-mono text-gray-900">{vb.sharePct}%</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#FF6600] h-full rounded-full transition-all duration-500"
                      style={{ width: `${vb.sharePct}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Vendor Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[10px] text-gray-400">
                <span>Avg Rate: <strong className="text-gray-700 font-mono">Rs. {vb.avgRate.toLocaleString("en-PK")}/t</strong></span>
                <span>{vb.dispatchesCount} Shipments Logged</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: FUEL SENT TO EACH SITE BREAKDOWN */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-100 text-blue-600">
                <Building2 className="w-4 h-4" />
              </span>
              <h2 className="text-base font-extrabold text-gray-900">
                Fuel Sent to Each Site & Station Consumption
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Live tracking of biomass tonnage dispatched, received at site weighbridges, and burned in boiler units
            </p>
          </div>

          <span className="text-xs font-bold text-gray-400">
            4 Active Industrial Sites
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {siteBreakdown.map((sb, idx) => (
            <div
              key={idx}
              className="bg-gray-50/70 rounded-2xl border border-gray-200/90 p-5 space-y-4 hover:shadow-sm transition-all"
            >
              {/* Site Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-extrabold text-gray-900 text-base">{sb.name}</h3>
                  <span className="text-xs font-semibold text-[#FF6600] block mt-0.5">
                    {sb.boilerModel}
                  </span>
                </div>

                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                  {sb.autonomyDays} Days Autonomy
                </span>
              </div>

              {/* Station Staff Info */}
              <div className="p-2.5 bg-white rounded-xl border border-gray-200/70 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold block uppercase">Site Supervisor:</span>
                  <span className="font-bold text-gray-800">{sb.supervisor}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold block uppercase">Boiler Foreman:</span>
                  <span className="font-bold text-gray-800">{sb.foreman}</span>
                </div>
              </div>

              {/* 3 Metric Pills */}
              <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-gray-200/70">
                  <span className="text-[10px] font-sans font-medium text-gray-400 block">Sent / Dispatched</span>
                  <span className="font-black text-gray-900 text-sm mt-0.5 block">{sb.dispatched.toFixed(1)} t</span>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-gray-200/70">
                  <span className="text-[10px] font-sans font-medium text-gray-400 block">Weighbridge Received</span>
                  <span className="font-black text-emerald-700 text-sm mt-0.5 block">{sb.received.toFixed(1)} t</span>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-gray-200/70">
                  <span className="text-[10px] font-sans font-medium text-gray-400 block">Total Burned</span>
                  <span className="font-black text-orange-600 text-sm mt-0.5 block">{sb.burned} t</span>
                </div>
              </div>

              {/* Silo Capacity Progress */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 font-medium">Site Silo Reserve Level:</span>
                  <span className="font-mono font-bold text-gray-900">{sb.currentStock.toFixed(1)} Tonnes</span>
                </div>
                <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: `${Math.min(100, (sb.currentStock / 50) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
                <span>Primary Fuel: <strong className="text-gray-700 font-medium">{sb.primaryFuel}</strong></span>
                <span>{sb.dispatchesCount} Truck Delivery Slips</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: MONTH-ENDING HOW MUCH FUEL (RECONCILIATION & VARIANCE AUDIT) */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-600">
                <Boxes className="w-4 h-4" />
              </span>
              <h2 className="text-base font-extrabold text-gray-900">
                Month-Ending Fuel Stock & Silo Autonomy
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Opening balance + Received from Vendors - Burned in Boilers = Book Ending vs Physical Silo Dip Soundings
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
              Audit Period: October 2026
            </span>
          </div>
        </div>

        <div className="border border-gray-200 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F9FB] border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Site & Silo Location</th>
                  <th className="py-3 px-4">Fuel Type</th>
                  <th className="py-3 px-4 text-center">Opening Stock (1st)</th>
                  <th className="py-3 px-4 text-center">Received</th>
                  <th className="py-3 px-4 text-center">Burned / Consumed</th>
                  <th className="py-3 px-4 text-center">Book Ending Stock</th>
                  <th className="py-3 px-4 text-center">Physical Silo Dip</th>
                  <th className="py-3 px-4 text-center">Variance (kg / %)</th>
                  <th className="py-3 px-4 text-center">Reserve Runway</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-mono text-[11px]">
                {monthEndList.map((me) => (
                  <tr key={me.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-4 font-sans">
                      <div className="font-bold text-gray-900">{me.siteName}</div>
                      <div className="text-[10px] text-gray-400 font-mono">{me.boilerModel}</div>
                    </td>

                    <td className="py-3 px-4 font-sans font-medium text-gray-700">
                      {me.fuelType}
                    </td>

                    <td className="py-3 px-4 text-center font-bold text-gray-700">
                      {me.openingStock.toFixed(1)} {me.unit}
                    </td>

                    <td className="py-3 px-4 text-center font-bold text-emerald-700">
                      +{me.receivedStock.toFixed(1)} {me.unit}
                    </td>

                    <td className="py-3 px-4 text-center font-bold text-orange-600">
                      -{me.consumedStock.toFixed(1)} {me.unit}
                    </td>

                    <td className="py-3 px-4 text-center font-black text-gray-900 bg-gray-50/50">
                      {me.bookClosingStock.toFixed(1)} {me.unit}
                    </td>

                    <td className="py-3 px-4 text-center font-black text-blue-700 bg-blue-50/30">
                      {me.physicalDipStock.toFixed(1)} {me.unit}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        Math.abs(me.variancePercentage) <= 2.0
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}>
                        {me.varianceQuantity > 0 ? `+${me.varianceQuantity}` : me.varianceQuantity} kg ({me.variancePercentage}%)
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center font-sans font-bold text-emerald-700">
                      {(me.physicalDipStock / 3.2).toFixed(1)} Days
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-[#F8F9FB] border-t border-gray-200 font-mono font-black text-xs">
                <tr>
                  <td colSpan={2} className="py-3 px-4 font-sans uppercase text-gray-800">Fleet Totals:</td>
                  <td className="py-3 px-4 text-center">{totalOpeningStockTons.toFixed(1)} Tonnes</td>
                  <td className="py-3 px-4 text-center text-emerald-700">+{totalReceivedTons.toFixed(1)} Tonnes</td>
                  <td className="py-3 px-4 text-center text-orange-600">-{totalBurnedTons.toFixed(1)} Tonnes</td>
                  <td className="py-3 px-4 text-center bg-gray-100 text-gray-900">
                    {(totalOpeningStockTons + totalReceivedTons - totalBurnedTons).toFixed(1)} Tonnes
                  </td>
                  <td className="py-3 px-4 text-center bg-blue-100 text-blue-900">
                    {totalClosingStockTons.toFixed(1)} Tonnes
                  </td>
                  <td className="py-3 px-4 text-center text-emerald-700">
                    -1.2% Overall
                  </td>
                  <td className="py-3 px-4 text-center font-sans text-emerald-700">
                    13.8 Days Runway
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* SECTION 4: RECENT FUEL DELIVERIES & WEIGHBRIDGE AUDIT FEED */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 gap-3">
          <div>
            <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#FF6600]" />
              Recent Fuel Dispatches & Weighbridge Audit Trail
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Dispatched tonnage, weighbridge received tonnage, driver phone, vehicle plate, and proof slips
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-gray-400">Filter Site:</span>
            <select
              value={selectedSiteFilter}
              onChange={(e) => setSelectedSiteFilter(e.target.value)}
              className="px-2.5 py-1 text-xs font-semibold border border-gray-200 rounded-xl bg-white focus:outline-none"
            >
              <option value="All">All Sites</option>
              <option value="Riverside">Riverside Mill</option>
              <option value="Faisalabad">Faisalabad Complex</option>
              <option value="Highland">Highland Biofuels</option>
              <option value="Prime Cotton">Prime Cotton</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {filteredDispatches.map((disp) => (
            <div
              key={disp.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/60 transition-colors rounded-xl px-2"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF6600] flex items-center justify-center shrink-0 border border-orange-100">
                  <Truck className="w-5 h-5" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-gray-900">{disp.dispatchNo}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      {disp.targetSite.split("(")[0]}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      disp.status === "Delivered & Verified"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}>
                      {disp.status}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-gray-800 mt-0.5">
                    {disp.fuelType} • <span className="font-medium text-gray-500">{disp.vendorName}</span>
                  </div>

                  <div className="flex items-center gap-3 text-[10px] text-gray-400 mt-1">
                    <span>Vehicle: <strong className="text-gray-600">{disp.vehicleNo}</strong></span>
                    <span>Driver: <strong className="text-gray-600">{disp.driverName} ({disp.driverPhone})</strong></span>
                    <span>Date: <strong className="text-gray-600 font-mono">{disp.deliveryDate}</strong></span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="font-mono font-black text-sm text-gray-900">
                  {disp.receivedTons > 0 ? `${disp.receivedTons} t` : `${disp.dispatchedTons} t (In Transit)`}
                </div>
                <div className="text-[11px] font-mono text-[#FF6600] font-bold">
                  Rs. {disp.totalCostPkr.toLocaleString("en-PK")}
                </div>
                {disp.varianceTons !== 0 && (
                  <div className="text-[10px] font-mono text-gray-400">
                    Variance: {disp.varianceTons} t ({disp.variancePct}%)
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
