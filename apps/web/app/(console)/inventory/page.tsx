"use client";

import { useState, useEffect } from "react";
import {
  Boxes,
  Plus,
  Search,
  AlertTriangle,
  Fuel,
  ArrowDownLeft,
  ArrowUpRight,
  History,
  FileCheck2,
  Calendar,
  Building2,
  X,
  TrendingDown,
  TrendingUp,
  CheckCircle2,
  Layers,
  ChevronRight,
} from "lucide-react";
import {
  DemoStore,
  DemoInventoryItem,
  DemoStockCategory,
  DemoStockUnit,
  DemoStockMovement,
  DemoMonthEndReconciliation,
  DemoBoiler,
  DemoSupplier,
} from "../../demo-store";

export default function InventoryConsolePage() {
  const [activeTab, setActiveTab] = useState<"STOCK" | "MOVEMENTS" | "MONTH_END">("STOCK");
  const [inventory, setInventory] = useState<DemoInventoryItem[]>([]);
  const [categories, setCategories] = useState<DemoStockCategory[]>([]);
  const [units, setUnits] = useState<DemoStockUnit[]>([]);
  const [movements, setMovements] = useState<DemoStockMovement[]>([]);
  const [monthEndList, setMonthEndList] = useState<DemoMonthEndReconciliation[]>([]);
  const [boilers, setBoilers] = useState<DemoBoiler[]>([]);
  const [suppliers, setSuppliers] = useState<DemoSupplier[]>([]);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Modal 1: New Stock Item
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [location, setLocation] = useState("Central Warehouse #1 (Bay A)");
  const [quantity, setQuantity] = useState("20");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [reorderLevel, setReorderLevel] = useState("5");
  const [unitCost, setUnitCost] = useState("95.00");

  // Modal 2: Stock In (Receipt)
  const [isStockInModalOpen, setIsStockInModalOpen] = useState(false);
  const [stockInItemId, setStockInItemId] = useState("");
  const [stockInQty, setStockInQty] = useState("10");
  const [stockInVendor, setStockInVendor] = useState("");
  const [stockInRef, setStockInRef] = useState("PO-2026-108");
  const [stockInSite, setStockInSite] = useState("Central Warehouse #1 (Bay A)");
  const [stockInNotes, setStockInNotes] = useState("");

  // Modal 3: Stock Out (Issue / Consumption)
  const [isStockOutModalOpen, setIsStockOutModalOpen] = useState(false);
  const [stockOutItemId, setStockOutItemId] = useState("");
  const [stockOutQty, setStockOutQty] = useState("2.5");
  const [stockOutBoilerId, setStockOutBoilerId] = useState("");
  const [stockOutPurpose, setStockOutPurpose] = useState("Daily Biomass Feed Run");
  const [stockOutIssuedTo, setStockOutIssuedTo] = useState("Liam Harper (Lead Operator)");
  const [stockOutNotes, setStockOutNotes] = useState("");

  // Modal 4: Month-End Stock-Take
  const [isMonthEndModalOpen, setIsMonthEndModalOpen] = useState(false);
  const [meSite, setMeSite] = useState("Apex Textile Mills - Sector 4");
  const [meBoilerModel, setMeBoilerModel] = useState("Thermax SteamMax 5T");
  const [meMonth, setMeMonth] = useState("October 2026");
  const [meFuelType, setMeFuelType] = useState("Rice Husk Bulk (Grade A)");
  const [meOpening, setMeOpening] = useState("46.8");
  const [meReceived, setMeReceived] = useState("25.0");
  const [meConsumed, setMeConsumed] = useState("23.3");
  const [mePhysicalDip, setMePhysicalDip] = useState("48.5");
  const [meReason, setMeReason] = useState("Physical silo dip reconciled against weighbridge logs.");
  const [meSupervisor, setMeSupervisor] = useState("Tariq Mahmood");
  const [meForeman, setMeForeman] = useState("Liam Harper");

  const refreshData = () => {
    const inv = DemoStore.getInventory();
    setInventory(inv);
    const cats = DemoStore.getStockCategories();
    setCategories(cats);
    const uList = DemoStore.getStockUnits();
    setUnits(uList);
    setMovements(DemoStore.getStockMovements());
    setMonthEndList(DemoStore.getMonthEndReconciliations());
    const bList = DemoStore.getBoilers();
    setBoilers(bList);
    const sList = DemoStore.getSuppliers();
    setSuppliers(sList);

    if (cats.length > 0 && !selectedCategory && cats[0]) setSelectedCategory(cats[0].name);
    if (uList.length > 0 && !selectedUnit && uList[0]) setSelectedUnit(uList[0].abbreviation);
    if (inv.length > 0 && !stockInItemId && inv[0]) setStockInItemId(inv[0].id);
    if (inv.length > 0 && !stockOutItemId && inv[0]) setStockOutItemId(inv[0].id);
    if (sList.length > 0 && !stockInVendor && sList[0]) setStockInVendor(sList[0].name);
    if (bList.length > 0 && !stockOutBoilerId && bList[0]) setStockOutBoilerId(bList[0].id);
  };

  useEffect(() => {
    refreshData();
    const unsub = DemoStore.subscribe(refreshData);
    return () => unsub();
  }, []);

  // Filter Items
  const filteredItems = inventory.filter((item) => {
    const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
    const matchesSearch =
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalValuation = inventory.reduce((sum, item) => sum + item.totalValue, 0);
  const biofuelReserves = inventory
    .filter((i) => i.category.toLowerCase().includes("biofuel") || i.category.toLowerCase().includes("fuel"))
    .reduce((sum, i) => sum + i.quantity, 0);
  const lowStockCount = inventory.filter((i) => i.status !== "Optimal").length;

  // Handlers
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    DemoStore.addInventoryItem({
      sku: sku || `SKU-${Date.now().toString().slice(-4)}`,
      name,
      category: selectedCategory || categories[0]?.name || "Biofuel Bulk",
      location,
      quantity: parseFloat(quantity) || 0,
      unit: selectedUnit || units[0]?.abbreviation || "Tonnes",
      reorderLevel: parseFloat(reorderLevel) || 0,
      unitCost: parseFloat(unitCost) || 0,
    });
    setIsNewItemModalOpen(false);
    setName("");
    setSku("");
  };

  const handleStockIn = (e: React.FormEvent) => {
    e.preventDefault();
    const user = DemoStore.getActiveUser();
    DemoStore.recordStockIn({
      itemId: stockInItemId,
      quantity: parseFloat(stockInQty) || 0,
      reference: stockInRef,
      vendorName: stockInVendor,
      siteName: stockInSite,
      performedBy: user.name,
      notes: stockInNotes || "Received shipment verified against delivery ticket.",
    });
    setIsStockInModalOpen(false);
    setStockInNotes("");
  };

  const handleStockOut = (e: React.FormEvent) => {
    e.preventDefault();
    const targetB = boilers.find((b) => b.id === stockOutBoilerId);
    const user = DemoStore.getActiveUser();
    DemoStore.recordStockOut({
      itemId: stockOutItemId,
      quantity: parseFloat(stockOutQty) || 0,
      boilerId: targetB?.id,
      boilerModel: targetB?.model,
      siteName: targetB?.siteName || "Central Plant",
      reference: stockOutPurpose,
      issuedTo: stockOutIssuedTo,
      performedBy: user.name,
      notes: stockOutNotes || "Shift consumption issued to active stoker burner.",
    });
    setIsStockOutModalOpen(false);
    setStockOutNotes("");
  };

  const handleMonthEndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const op = parseFloat(meOpening) || 0;
    const rc = parseFloat(meReceived) || 0;
    const co = parseFloat(meConsumed) || 0;
    const bookClosing = Number((op + rc - co).toFixed(2));
    const physical = parseFloat(mePhysicalDip) || 0;
    const varianceQty = Number((physical - bookClosing).toFixed(2));
    const variancePct = bookClosing > 0 ? Number(((varianceQty / bookClosing) * 100).toFixed(2)) : 0;

    DemoStore.addMonthEndReconciliation({
      month: meMonth,
      date: new Date().toISOString().slice(0, 10),
      siteName: meSite,
      boilerModel: meBoilerModel,
      fuelType: meFuelType,
      unit: "Tonnes",
      openingStock: op,
      receivedStock: rc,
      consumedStock: co,
      bookClosingStock: bookClosing,
      physicalDipStock: physical,
      varianceQuantity: varianceQty,
      variancePercentage: variancePct,
      varianceReason: meReason,
      supervisorName: meSupervisor,
      foremanName: meForeman,
      status: Math.abs(variancePct) > 3.0 ? "Discrepancy Under Audit" : "Reconciled",
    });

    setIsMonthEndModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-100 text-[#FF6600] uppercase tracking-wider">
              Warehouse & Stock Ledger
            </span>
            <span className="text-xs text-gray-500 font-medium">Stock In / Out · Month-End Ending</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 mt-1">
            Inventory & Warehouses
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Biomass fuel reserves, water chemistry drums, spares stock movements, and month-end fuel reconciliations.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsStockInModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all shadow-sm"
          >
            <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
            <span>Stock In (Receipt)</span>
          </button>

          <button
            onClick={() => setIsStockOutModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-all shadow-sm"
          >
            <ArrowUpRight className="w-4 h-4 text-amber-600" />
            <span>Stock Out (Issue)</span>
          </button>

          <button
            onClick={() => setIsNewItemModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#FF6600] hover:bg-[#E65C00] rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Stock Item</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Total Stock Valuation
            </div>
            <div className="text-2xl sm:text-3xl font-black text-gray-900 font-mono tracking-tight mt-1">
              Rs. {totalValuation.toLocaleString("en-PK", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
            <div className="text-[11px] text-gray-500 mt-1">Across 4 Central Site Depots</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF6600]">
            <Boxes className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Biomass Fuel Reserves
            </div>
            <div className="text-2xl sm:text-3xl font-black text-gray-900 font-mono tracking-tight mt-1">
              {biofuelReserves.toFixed(1)} <span className="text-xs font-bold text-gray-500">Tonnes</span>
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Est. 12.5 Days Run Autonomy</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Fuel className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Reorder Attention
            </div>
            <div className="text-2xl sm:text-3xl font-black text-gray-900 font-mono tracking-tight mt-1">
              {lowStockCount} <span className="text-xs font-bold text-gray-500">SKUs</span>
            </div>
            <div className="text-[11px] text-amber-600 font-semibold mt-1 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Safety threshold breached</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-none gap-2">
        <button
          onClick={() => setActiveTab("STOCK")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
            activeTab === "STOCK"
              ? "border-[#FF6600] text-[#FF6600]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>Registered Stock Items</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-gray-100 text-gray-600 font-semibold">
            {inventory.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("MOVEMENTS")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
            activeTab === "MOVEMENTS"
              ? "border-[#FF6600] text-[#FF6600]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <History className="w-4 h-4" />
          <span>Stock In & Out History</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-orange-100 text-[#FF6600] font-semibold">
            {movements.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("MONTH_END")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
            activeTab === "MONTH_END"
              ? "border-[#FF6600] text-[#FF6600]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Month-End Fuel Ending & Reconciliations</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-700 font-semibold">
            {monthEndList.length} Reconciled
          </span>
        </button>
      </div>

      {/* TAB 1: CURRENT STOCK ON HAND */}
      {activeTab === "STOCK" && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-3.5 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider shrink-0 mr-1">
                Category:
              </span>
              <button
                onClick={() => setCategoryFilter("All")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  categoryFilter === "All"
                    ? "bg-[#181B20] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.name)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    categoryFilter === cat.name
                      ? "bg-[#FF6600] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search SKU, name, location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAFBFD] border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">SKU & Item Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Storage Depot / Warehouse</th>
                    <th className="py-3 px-4 text-center">Available Stock</th>
                    <th className="py-3 px-4 text-right">Unit Cost</th>
                    <th className="py-3 px-4 text-right">Total Valuation</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-gray-900">{item.sku}</div>
                        <div className="font-semibold text-gray-800 text-[11px]">{item.name}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[10px]">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{item.location}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="font-mono font-extrabold text-sm text-gray-900">
                          {item.quantity}
                        </span>{" "}
                        <span className="text-[10px] text-gray-500 font-bold">{item.unit}</span>
                        <div className="text-[9px] text-gray-400">Reorder at: {item.reorderLevel} {item.unit}</div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-gray-800">
                        Rs. {item.unitCost.toLocaleString("en-PK", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-extrabold text-gray-900">
                        Rs. {item.totalValue.toLocaleString("en-PK", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {item.status === "Optimal" && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Optimal
                          </span>
                        )}
                        {item.status === "Low Stock" && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            Low Stock
                          </span>
                        )}
                        {item.status === "Critical" && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
                            Critical Alert
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setStockInItemId(item.id);
                              setIsStockInModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 border border-emerald-200"
                            title="Stock In (Receive)"
                          >
                            <ArrowDownLeft className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setStockOutItemId(item.id);
                              setIsStockOutModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-amber-700 hover:bg-amber-50 border border-amber-200"
                            title="Stock Out (Issue to Boiler)"
                          >
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STOCK IN & STOCK OUT MOVEMENTS */}
      {activeTab === "MOVEMENTS" && (
        <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm overflow-hidden space-y-3">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="font-extrabold text-sm sm:text-base text-gray-900">
                Stock Movements & Audit History
              </h2>
              <p className="text-xs text-gray-500">
                Live chronological log of all warehouse receipts (Stock In) and shift issuances (Stock Out).
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                <ArrowDownLeft className="w-3 h-3" /> Stock In
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                <ArrowUpRight className="w-3 h-3" /> Stock Out
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAFBFD] border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Movement ID & Date</th>
                  <th className="py-3 px-4">Transaction Type</th>
                  <th className="py-3 px-4">Item & Category</th>
                  <th className="py-3 px-4 text-center">Quantity</th>
                  <th className="py-3 px-4">Source / Destination / Boiler</th>
                  <th className="py-3 px-4">Reference Document</th>
                  <th className="py-3 px-4 text-center">Balance After</th>
                  <th className="py-3 px-4">Performed By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {movements.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-gray-900">{m.movementNumber}</div>
                      <div className="text-[10px] text-gray-500">{m.date}</div>
                    </td>
                    <td className="py-3 px-4">
                      {m.type === "STOCK_IN" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <ArrowDownLeft className="w-3 h-3" /> Stock In
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-amber-50 text-amber-700 border border-amber-200">
                          <ArrowUpRight className="w-3 h-3" /> Stock Out
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-gray-900">{m.itemName}</div>
                      <div className="text-[10px] text-gray-500">{m.itemSku} · {m.category}</div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-mono font-black text-xs ${m.type === "STOCK_IN" ? "text-emerald-700" : "text-amber-700"}`}>
                        {m.type === "STOCK_IN" ? "+" : "-"}{m.quantity} {m.unit}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {m.boilerModel ? (
                        <div>
                          <div className="font-semibold text-gray-900">{m.boilerModel}</div>
                          <div className="text-[10px] text-gray-500">{m.siteName}</div>
                        </div>
                      ) : (
                        <div>
                          <div className="font-semibold text-gray-900">{m.vendorName || m.siteName}</div>
                          <div className="text-[10px] text-gray-500">{m.siteName}</div>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-mono text-[11px] font-bold text-gray-700">{m.reference}</div>
                      {m.notes && <div className="text-[10px] text-gray-400 italic line-clamp-1">{m.notes}</div>}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-gray-900">
                      {m.balanceAfter} {m.unit}
                    </td>
                    <td className="py-3 px-4 text-gray-600 font-medium">
                      {m.performedBy}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: MONTH-END FUEL ENDING & RECONCILIATIONS */}
      {activeTab === "MONTH_END" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-extrabold text-gray-900">
                    Month-End Fuel Reconciliation & Ending Stock
                  </h2>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    Official Audit Trail
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Reconciliation formula: Opening Stock + Received (Stock In) - Burned (Consumed) = Book Ending vs Physical Silo Dip.
                </p>
              </div>

              <button
                onClick={() => setIsMonthEndModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#FF6600] hover:bg-[#E65C00] rounded-xl shadow-sm transition-all shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Perform Month-End Stock Count</span>
              </button>
            </div>

            <div className="overflow-x-auto border border-gray-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAFBFD] border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Reconciliation & Month</th>
                    <th className="py-3 px-4">Site Facility & Fuel Type</th>
                    <th className="py-3 px-3 text-center">Opening Stock</th>
                    <th className="py-3 px-3 text-center">Received (+In)</th>
                    <th className="py-3 px-3 text-center">Consumed (-Out)</th>
                    <th className="py-3 px-3 text-center">Book Ending</th>
                    <th className="py-3 px-3 text-center">Physical Dip</th>
                    <th className="py-3 px-3 text-center">Variance (Qty / %)</th>
                    <th className="py-3 px-4">Sign-offs (Supv / Foreman)</th>
                    <th className="py-3 px-4 text-center">Audit Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {monthEndList.map((rec) => {
                    const isWithinTolerance = Math.abs(rec.variancePercentage) <= 2.5;
                    return (
                      <tr key={rec.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-mono font-bold text-gray-900">{rec.code}</div>
                          <div className="text-[11px] font-bold text-orange-600 mt-0.5">{rec.month}</div>
                          <div className="text-[10px] text-gray-400">Date: {rec.date}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-gray-900">{rec.siteName}</div>
                          <div className="text-[11px] text-gray-500 font-medium">{rec.fuelType}</div>
                          <div className="text-[10px] text-gray-400">{rec.boilerModel}</div>
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-semibold text-gray-700">
                          {rec.openingStock.toFixed(1)}t
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-semibold text-emerald-600">
                          +{rec.receivedStock.toFixed(1)}t
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-semibold text-amber-600">
                          -{rec.consumedStock.toFixed(1)}t
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-gray-900 bg-gray-50/60">
                          {rec.bookClosingStock.toFixed(1)}t
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-extrabold text-[#FF6600] bg-orange-50/40">
                          {rec.physicalDipStock.toFixed(1)}t
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className={`font-mono font-bold text-[11px] px-2 py-0.5 rounded-full ${
                            isWithinTolerance
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}>
                            {rec.varianceQuantity > 0 ? "+" : ""}{rec.varianceQuantity}t ({rec.variancePercentage}%)
                          </span>
                          <div className="text-[9px] text-gray-400 mt-0.5 max-w-[140px] truncate mx-auto">
                            {rec.varianceReason}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-[11px] font-semibold text-gray-900">
                            Supv: {rec.supervisorName}
                          </div>
                          <div className="text-[10px] text-gray-500">
                            Foreman: {rec.foremanName}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {rec.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: NEW STOCK ITEM */}
      {isNewItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-extrabold text-base text-gray-900">Add Registered Stock Item</h3>
              <button
                onClick={() => setIsNewItemModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-3.5 mt-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Item Name / Description</label>
                <input
                  type="text"
                  placeholder="e.g. Rice Husk Biofuel Bulk (Grade A)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Category (From Settings)</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Unit of Measure (UOM)</label>
                  <select
                    value={selectedUnit}
                    onChange={(e) => setSelectedUnit(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                  >
                    {units.map((u) => (
                      <option key={u.id} value={u.abbreviation}>
                        {u.name} ({u.abbreviation})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Warehouse Depot Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Initial Quantity</label>
                  <input
                    type="number"
                    step="0.1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                    className="w-full px-3 py-1.5 text-xs font-mono border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF6600]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Reorder Level</label>
                  <input
                    type="number"
                    step="0.1"
                    value={reorderLevel}
                    onChange={(e) => setReorderLevel(e.target.value)}
                    required
                    className="w-full px-3 py-1.5 text-xs font-mono border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF6600]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Unit Cost (PKR / Rs.)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={unitCost}
                    onChange={(e) => setUnitCost(e.target.value)}
                    required
                    className="w-full px-3 py-1.5 text-xs font-mono border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF6600]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsNewItemModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#FF6600] hover:bg-[#E65C00] rounded-xl shadow-sm transition-all"
                >
                  Save Stock Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: STOCK IN (RECEIPT) */}
      {isStockInModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                  <ArrowDownLeft className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-base text-gray-900">Record Stock In (Receipt)</h3>
              </div>
              <button
                onClick={() => setIsStockInModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleStockIn} className="space-y-3.5 mt-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Select Stock Item</label>
                <select
                  value={stockInItemId}
                  onChange={(e) => setStockInItemId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                >
                  {inventory.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.sku} - {item.name} (Current: {item.quantity} {item.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Quantity to Receive</label>
                  <input
                    type="number"
                    step="0.1"
                    value={stockInQty}
                    onChange={(e) => setStockInQty(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs font-mono font-bold border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Supplier / Vendor</label>
                  <select
                    value={stockInVendor}
                    onChange={(e) => setStockInVendor(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                  >
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  PO / Challan / Delivery Slip Reference
                </label>
                <input
                  type="text"
                  placeholder="e.g. PO-2026-108 / Weighbridge Slip #441"
                  value={stockInRef}
                  onChange={(e) => setStockInRef(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Receiving Depot / Bay</label>
                <input
                  type="text"
                  value={stockInSite}
                  onChange={(e) => setStockInSite(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Remarks & Moisture %</label>
                <input
                  type="text"
                  placeholder="e.g. Net weighbridge verified. Moisture 8.5%."
                  value={stockInNotes}
                  onChange={(e) => setStockInNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsStockInModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all"
                >
                  Confirm Stock In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: STOCK OUT (ISSUE / CONSUMPTION) */}
      {isStockOutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-base text-gray-900">Record Stock Out (Issue)</h3>
              </div>
              <button
                onClick={() => setIsStockOutModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleStockOut} className="space-y-3.5 mt-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Select Stock Item</label>
                <select
                  value={stockOutItemId}
                  onChange={(e) => setStockOutItemId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                >
                  {inventory.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.sku} - {item.name} (Available: {item.quantity} {item.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Quantity to Disburse</label>
                  <input
                    type="number"
                    step="0.1"
                    value={stockOutQty}
                    onChange={(e) => setStockOutQty(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs font-mono font-bold border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Stationed Boiler</label>
                  <select
                    value={stockOutBoilerId}
                    onChange={(e) => setStockOutBoilerId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                  >
                    {boilers.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.code} ({b.model})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Purpose / Shift Job Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Morning Shift Fuel Feeding / Dosing Tank Batch"
                  value={stockOutPurpose}
                  onChange={(e) => setStockOutPurpose(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Issued to (Staff / Tech)</label>
                <input
                  type="text"
                  value={stockOutIssuedTo}
                  onChange={(e) => setStockOutIssuedTo(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsStockOutModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-sm transition-all"
                >
                  Confirm Stock Out
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: PERFORM MONTH-END STOCK-TAKE */}
      {isMonthEndModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-extrabold text-base text-gray-900">
                Month-End Fuel Reconciliation
              </h3>
              <button
                onClick={() => setIsMonthEndModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleMonthEndSubmit} className="space-y-3.5 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Month Period</label>
                  <input
                    type="text"
                    value={meMonth}
                    onChange={(e) => setMeMonth(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Fuel Type</label>
                  <input
                    type="text"
                    value={meFuelType}
                    onChange={(e) => setMeFuelType(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Client Site Facility</label>
                <select
                  value={meSite}
                  onChange={(e) => setMeSite(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                >
                  <option value="Apex Textile Mills - Sector 4">Apex Textile Mills - Sector 4</option>
                  <option value="GreenBio Bio-Refinery Unit 2">GreenBio Bio-Refinery Unit 2</option>
                  <option value="Prime Mills - Boiler Bay C">Prime Mills - Boiler Bay C</option>
                  <option value="SunGlow Dairy & Beverage Plant">SunGlow Dairy & Beverage Plant</option>
                  <option value="Indus Wet Processing Zone">Indus Wet Processing Zone</option>
                </select>
              </div>

              {/* Formula inputs */}
              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">
                  Book Balance & Physical Silo Dip (Tonnes)
                </span>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="block text-[10px] text-gray-500 font-bold mb-0.5">Opening</label>
                    <input
                      type="number"
                      step="0.1"
                      value={meOpening}
                      onChange={(e) => setMeOpening(e.target.value)}
                      className="w-full px-2 py-1 text-xs font-mono font-bold border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-emerald-600 font-bold mb-0.5">+ Received</label>
                    <input
                      type="number"
                      step="0.1"
                      value={meReceived}
                      onChange={(e) => setMeReceived(e.target.value)}
                      className="w-full px-2 py-1 text-xs font-mono font-bold border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-amber-600 font-bold mb-0.5">- Consumed</label>
                    <input
                      type="number"
                      step="0.1"
                      value={meConsumed}
                      onChange={(e) => setMeConsumed(e.target.value)}
                      className="w-full px-2 py-1 text-xs font-mono font-bold border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#FF6600] font-bold mb-0.5">Physical Dip</label>
                    <input
                      type="number"
                      step="0.1"
                      value={mePhysicalDip}
                      onChange={(e) => setMePhysicalDip(e.target.value)}
                      className="w-full px-2 py-1 text-xs font-mono font-bold border border-orange-300 rounded bg-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Variance Analysis / Audit Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ambient silo humidity loss within 2% engineering allowance."
                  value={meReason}
                  onChange={(e) => setMeReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Site Supervisor Sign-off</label>
                  <input
                    type="text"
                    value={meSupervisor}
                    onChange={(e) => setMeSupervisor(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Boiler Foreman Sign-off</label>
                  <input
                    type="text"
                    value={meForeman}
                    onChange={(e) => setMeForeman(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsMonthEndModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#FF6600] hover:bg-[#E65C00] rounded-xl shadow-sm transition-all"
                >
                  Sign & Save Reconciliation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
