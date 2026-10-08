"use client";

import { useState, useEffect } from "react";
import {
  Boxes,
  Plus,
  Search,
  AlertTriangle,
  CheckCircle2,
  Package,
  Layers,
  Fuel,
  TrendingDown,
  X,
  Warehouse,
} from "lucide-react";
import { DemoStore, DemoInventoryItem } from "../../demo-store";

export default function InventoryConsolePage() {
  const [inventory, setInventory] = useState<DemoInventoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // New Item Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState<DemoInventoryItem["category"]>("Biofuel Bulk");
  const [location, setLocation] = useState("Central Warehouse #1 (Bay A)");
  const [quantity, setQuantity] = useState("20");
  const [unit, setUnit] = useState("Tonnes");
  const [reorderLevel, setReorderLevel] = useState("5");
  const [unitCost, setUnitCost] = useState("95.00");

  const refreshData = () => {
    setInventory(DemoStore.getInventory());
  };

  useEffect(() => {
    refreshData();
    const unsub = DemoStore.subscribe(refreshData);
    return () => unsub();
  }, []);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    DemoStore.addInventoryItem({
      sku: sku || `SKU-${Date.now().toString().slice(-4)}`,
      name,
      category,
      location,
      quantity: parseFloat(quantity) || 0,
      unit,
      reorderLevel: parseFloat(reorderLevel) || 0,
      unitCost: parseFloat(unitCost) || 0,
    });
    setIsModalOpen(false);
    setName("");
    setSku("");
  };

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
    .filter((i) => i.category === "Biofuel Bulk")
    .reduce((sum, i) => sum + i.quantity, 0);
  const lowStockCount = inventory.filter((i) => i.status !== "Optimal").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-100 text-[#FF6600] uppercase tracking-wider">
              Warehouse & Stock Ledger
            </span>
            <span className="text-xs text-gray-500 font-medium">Enterprise Module</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 mt-1">
            Inventory & Warehouses
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Bulk biofuel reserves, water treatment chemicals, and mechanical boiler spare parts across site depots.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#FF6600] hover:bg-[#E65C00] rounded-xl shadow-sm hover:shadow transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Stock Item</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Stock Valuation</span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF6600] flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-gray-900">${totalValuation.toFixed(2)}</div>
            <div className="text-[11px] font-medium text-gray-500 mt-1">Weighted average cost (WAC)</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Bulk Biofuel Reserves</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Fuel className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-emerald-600">{biofuelReserves.toFixed(1)} Tonnes</div>
            <div className="text-[11px] font-medium text-emerald-700 mt-1">~12.5 days operational burn runway</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Reorder Alerts</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-amber-600">{lowStockCount} Items Low</div>
            <div className="text-[11px] font-medium text-amber-700 mt-1">Automatic PO recommendation triggered</div>
          </div>
        </div>
      </div>

      {/* Main Stock Table Container */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden p-4 sm:p-6 space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search SKU, item name, warehouse..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#FF6600]"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {["All", "Biofuel Bulk", "Water Chemicals", "Mechanical Spares", "Sensors & Electrical"].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  categoryFilter === cat
                    ? "bg-[#181B20] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3">SKU & Item Name</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Location / Depot</th>
                <th className="py-3 px-3">On-Hand Balance</th>
                <th className="py-3 px-3">Valuation (WAC)</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredItems.map((item) => {
                const statusBadge =
                  item.status === "Optimal"
                    ? "bg-emerald-100 text-emerald-800"
                    : item.status === "Critical"
                    ? "bg-rose-100 text-rose-800"
                    : "bg-amber-100 text-amber-800";

                return (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-mono font-bold text-gray-900">{item.sku}</div>
                      <div className="text-gray-600 font-medium">{item.name}</div>
                    </td>
                    <td className="py-3 px-3 text-gray-700">{item.category}</td>
                    <td className="py-3 px-3 text-gray-600">{item.location}</td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-gray-900">
                        {item.quantity} {item.unit}
                      </div>
                      <div className="text-[10px] text-gray-400">Reorder at: {item.reorderLevel} {item.unit}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-extrabold text-gray-900">${item.totalValue.toFixed(2)}</div>
                      <div className="text-[10px] text-gray-400">@${item.unitCost.toFixed(2)}/{item.unit}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${statusBadge}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: New Item */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-gray-100 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#FF6600] flex items-center justify-center">
                  <Boxes className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Add Inventory Item</h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">SKU / Item Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SKU-VLV-DN65"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Biofuel Bulk">Biofuel Bulk</option>
                    <option value="Water Chemicals">Water Chemicals</option>
                    <option value="Mechanical Spares">Mechanical Spares</option>
                    <option value="Sensors & Electrical">Sensors & Electrical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Description / Item Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DN65 High Pressure Steam Gate Valve"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Storage Location / Depot</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-2 py-2 rounded-xl border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">UoM</label>
                  <input
                    type="text"
                    required
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-2 py-2 rounded-xl border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Reorder Pt</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={reorderLevel}
                    onChange={(e) => setReorderLevel(e.target.value)}
                    className="w-full px-2 py-2 rounded-xl border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Unit Cost ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={unitCost}
                    onChange={(e) => setUnitCost(e.target.value)}
                    className="w-full px-2 py-2 rounded-xl border border-gray-300"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-[#FF6600] hover:bg-[#E65C00] rounded-xl shadow-sm"
                >
                  Add to Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
