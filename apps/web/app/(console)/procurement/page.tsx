"use client";

import { useState, useEffect } from "react";
import {
  ShoppingBag,
  Truck,
  Plus,
  Search,
  CheckCircle2,
  Building,
  DollarSign,
  Star,
  Flame,
  Check,
  X,
  MapPin,
  Phone,
  Mail,
  User,
  Clock,
  Boxes,
  FileText,
  Eye,
  Trash2,
  ChevronRight,
} from "lucide-react";
import {
  DemoStore,
  DemoPurchaseOrder,
  DemoSupplier,
  DemoBoiler,
  DemoInventoryItem,
  DemoStockCategory,
} from "../../demo-store";

export default function ProcurementPage() {
  const [activeTab, setActiveTab] = useState<"ORDERS" | "VENDORS" | "WEIGHBRIDGE">("ORDERS");
  const [purchaseOrders, setPurchaseOrders] = useState<DemoPurchaseOrder[]>([]);
  const [suppliers, setSuppliers] = useState<DemoSupplier[]>([]);
  const [boilers, setBoilers] = useState<DemoBoiler[]>([]);
  const [inventory, setInventory] = useState<DemoInventoryItem[]>([]);
  const [categories, setCategories] = useState<DemoStockCategory[]>([]);

  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal: New Purchase Order
  const [isPoModalOpen, setIsPoModalOpen] = useState(false);
  const [poSupplierId, setPoSupplierId] = useState("");
  const [poBoilerId, setPoBoilerId] = useState("");
  const [poTerms, setPoTerms] = useState("Net 30 Days");
  const [poItems, setPoItems] = useState<
    Array<{
      stockItemId?: string;
      description: string;
      category?: string;
      qty: string;
      uom: string;
      unitPrice: string;
    }>
  >([
    {
      stockItemId: "inv-01",
      description: "Rice Husk Biofuel Bulk (Grade A)",
      category: "Biofuel Bulk",
      qty: "20",
      uom: "Tonnes",
      unitPrice: "95.00",
    },
  ]);

  // Modal: Add New Vendor
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [vName, setVName] = useState("");
  const [vAddress, setVAddress] = useState("");
  const [vCity, setVCity] = useState("Faisalabad");
  const [vContactPerson, setVContactPerson] = useState("");
  const [vPhone, setVPhone] = useState("+92 300 ");
  const [vEmail, setVEmail] = useState("");
  const [vCategory, setVCategory] = useState("Biofuel Bulk");
  const [vTerms, setVTerms] = useState("Net 30 Days");
  const [vLeadDays, setVLeadDays] = useState("3");
  const [vStatus, setVStatus] = useState<DemoSupplier["status"]>("Approved");

  // Vendor Detail Drawer
  const [inspectedVendor, setInspectedVendor] = useState<DemoSupplier | null>(null);

  const refreshData = () => {
    setPurchaseOrders(DemoStore.getPurchaseOrders());
    const sups = DemoStore.getSuppliers();
    setSuppliers(sups);
    const bList = DemoStore.getBoilers();
    setBoilers(bList);
    const inv = DemoStore.getInventory();
    setInventory(inv);
    setCategories(DemoStore.getStockCategories());

    if (sups.length > 0 && !poSupplierId && sups[0]) {
      setPoSupplierId(sups[0].id);
    }
    if (bList.length > 0 && !poBoilerId && bList[0]) {
      setPoBoilerId(bList[0].id);
    }
  };

  useEffect(() => {
    refreshData();
    const unsub = DemoStore.subscribe(refreshData);
    return () => unsub();
  }, []);

  // When user selects a registered stock item for a PO line item, auto-fill all its attributes!
  const handleSelectStockItemForLine = (index: number, stockItemId: string) => {
    const stockItem = inventory.find((i) => i.id === stockItemId);
    const updated = [...poItems];
    const current = updated[index];
    if (!current) return;
    if (stockItem) {
      updated[index] = {
        stockItemId: stockItem.id,
        description: stockItem.name,
        category: stockItem.category,
        qty: current.qty || "1",
        uom: stockItem.unit,
        unitPrice: stockItem.unitCost.toFixed(2),
      };
    } else {
      updated[index] = {
        stockItemId: "",
        description: current.description,
        category: current.category,
        qty: current.qty,
        uom: current.uom,
        unitPrice: current.unitPrice,
      };
    }
    setPoItems(updated);
  };

  const handleAddLineItem = () => {
    const firstStock = inventory[0];
    if (firstStock) {
      setPoItems([
        ...poItems,
        {
          stockItemId: firstStock.id,
          description: firstStock.name,
          category: firstStock.category,
          qty: "10",
          uom: firstStock.unit,
          unitPrice: firstStock.unitCost.toFixed(2),
        },
      ]);
    } else {
      setPoItems([
        ...poItems,
        {
          description: "",
          qty: "1",
          uom: "Units",
          unitPrice: "0.00",
        },
      ]);
    }
  };

  const handleRemoveLineItem = (index: number) => {
    if (poItems.length > 1) {
      setPoItems(poItems.filter((_, i) => i !== index));
    }
  };

  const handleCreatePO = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedSup = suppliers.find((s) => s.id === poSupplierId) || suppliers[0];
    const selectedB = boilers.find((b) => b.id === poBoilerId) || boilers[0];
    if (!selectedSup || !selectedB) return;

    const lines = poItems.map((item) => {
      const q = parseFloat(item.qty) || 0;
      const p = parseFloat(item.unitPrice) || 0;
      return {
        description: item.description,
        qty: q,
        uom: item.uom,
        unitPrice: p,
        total: Number((q * p).toFixed(2)),
        stockItemId: item.stockItemId,
        category: item.category,
      };
    });

    const totalAmt = lines.reduce((acc, curr) => acc + curr.total, 0);
    const deliveryD = new Date();
    deliveryD.setDate(deliveryD.getDate() + (selectedSup.leadTimeDays || 3));

    DemoStore.addPurchaseOrder({
      supplierId: selectedSup.id,
      supplierName: selectedSup.name,
      siteName: selectedB.siteName,
      boilerId: selectedB.id,
      boilerModel: selectedB.model,
      issueDate: new Date().toISOString().slice(0, 10),
      deliveryDate: deliveryD.toISOString().slice(0, 10),
      items: lines,
      totalAmount: totalAmt,
      status: "Approved",
      paymentTerms: poTerms,
    });

    setIsPoModalOpen(false);
  };

  const handleCreateVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vName || !vPhone) return;

    DemoStore.addSupplier({
      name: vName,
      address: vAddress || "Industrial Estate Plot #12",
      city: vCity || "Lahore",
      contactPerson: vContactPerson || "Sales Representative",
      phone: vPhone,
      email: vEmail || "orders@vendor.pk",
      category: vCategory,
      paymentTerms: vTerms,
      rating: 4.8,
      leadTimeDays: parseInt(vLeadDays) || 3,
      status: vStatus,
    });

    setIsVendorModalOpen(false);
    setVName("");
    setVAddress("");
    setVContactPerson("");
    setVPhone("+92 300 ");
    setVEmail("");
  };

  const filteredPOs = purchaseOrders.filter((po) => {
    const matchesStatus = statusFilter === "All" || po.status === statusFilter;
    const matchesSearch =
      po.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.siteName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const filteredVendors = suppliers.filter((v) => {
    return (
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.city && v.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
      v.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const totalPoSpend = purchaseOrders.reduce((acc, curr) => acc + curr.totalAmount, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-100 text-[#FF6600] uppercase tracking-wider">
              Supply Chain & Orders
            </span>
            <span className="text-xs text-gray-500 font-medium">Auto-Populated Stock · Full Vendor Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 mt-1">
            Procurement & Vendors
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Purchase biomass fuels, chemicals, and mechanical parts with automated stock details and vetted vendor profiles.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsVendorModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl transition-all shadow-sm"
          >
            <Building className="w-4 h-4 text-[#FF6600]" />
            <span>Add New Vendor</span>
          </button>

          <button
            onClick={() => setIsPoModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#FF6600] hover:bg-[#E65C00] rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Purchase Order</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Total Purchase Orders
            </div>
            <div className="text-2xl sm:text-3xl font-black text-gray-900 font-mono tracking-tight mt-1">
              Rs. {totalPoSpend.toLocaleString("en-PK", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
            <div className="text-[11px] text-gray-500 mt-1">{purchaseOrders.length} active order contracts</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF6600]">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Vetted Vendor Network
            </div>
            <div className="text-2xl sm:text-3xl font-black text-gray-900 font-mono tracking-tight mt-1">
              {suppliers.length} <span className="text-xs font-bold text-gray-500">Suppliers</span>
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Full Name, Address, Contact & Terms</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Building className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Active Stock In-Transit
            </div>
            <div className="text-2xl sm:text-3xl font-black text-gray-900 font-mono tracking-tight mt-1">
              {purchaseOrders.filter((po) => po.status === "In Transit").length}{" "}
              <span className="text-xs font-bold text-gray-500">Trucks</span>
            </div>
            <div className="text-[11px] text-orange-600 font-semibold mt-1 flex items-center gap-1">
              <Truck className="w-3.5 h-3.5" />
              <span>Weighbridge tracking enabled</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <Truck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-none gap-2">
        <button
          onClick={() => setActiveTab("ORDERS")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
            activeTab === "ORDERS"
              ? "border-[#FF6600] text-[#FF6600]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Purchase Orders (Auto Stock Filled)</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-gray-100 text-gray-600 font-semibold">
            {purchaseOrders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("VENDORS")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
            activeTab === "VENDORS"
              ? "border-[#FF6600] text-[#FF6600]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Vendors & Suppliers Directory (5+ Features)</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-orange-100 text-[#FF6600] font-semibold">
            {suppliers.length}
          </span>
        </button>
      </div>

      {/* TAB 1: PURCHASE ORDERS */}
      {activeTab === "ORDERS" && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="bg-white p-3.5 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider shrink-0 mr-1">
                Status:
              </span>
              {["All", "Approved", "In Transit", "Received & Verified"].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    statusFilter === st
                      ? "bg-[#181B20] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search PO number, vendor..."
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
                    <th className="py-3 px-4">PO Number & Date</th>
                    <th className="py-3 px-4">Vendor & Supplier</th>
                    <th className="py-3 px-4">Target Boiler & Site</th>
                    <th className="py-3 px-4">Procured Stock Items</th>
                    <th className="py-3 px-4 text-right">Total Amount</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredPOs.map((po) => (
                    <tr key={po.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-gray-900">{po.poNumber}</div>
                        <div className="text-[10px] text-gray-500">Issued: {po.issueDate}</div>
                        <div className="text-[10px] text-orange-600 font-medium">ETA: {po.deliveryDate}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-gray-900">{po.supplierName}</div>
                        <div className="text-[10px] text-gray-400">{po.paymentTerms}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-gray-900">{po.boilerModel}</div>
                        <div className="text-[10px] text-gray-500">{po.siteName}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          {po.items.map((line, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 text-[11px]">
                              <span className="font-bold text-gray-800">{line.qty} {line.uom}</span>
                              <span className="text-gray-500 truncate max-w-[200px]">{line.description}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-extrabold text-sm text-gray-900">
                        Rs. {po.totalAmount.toLocaleString("en-PK", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          po.status === "Received & Verified"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : po.status === "In Transit"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                        }`}>
                          {po.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {po.status === "In Transit" ? (
                          <button
                            onClick={() => DemoStore.updatePOStatus(po.id, "Received & Verified")}
                            className="px-2.5 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors"
                          >
                            Verify Intake
                          </button>
                        ) : (
                          <span className="text-[10px] text-gray-400 font-semibold">Done</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VENDORS & SUPPLIERS DIRECTORY */}
      {activeTab === "VENDORS" && (
        <div className="space-y-4">
          <div className="bg-white p-3.5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              {suppliers.length} Approved Industrial Vendors & Contracted Suppliers
            </span>

            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search vendor, city, contact..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
              />
            </div>
          </div>

          {/* Vendors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVendors.map((vendor) => (
              <div
                key={vendor.id}
                className="bg-white rounded-2xl border border-gray-200/90 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  {/* Top: Name & Status */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-orange-100 text-[#FF6600]">
                        {vendor.code}
                      </span>
                      <h3 className="text-base font-extrabold text-gray-900 mt-1">{vendor.name}</h3>
                      <span className="text-[11px] font-semibold text-gray-500">{vendor.category}</span>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${
                      vendor.status === "Preferred"
                        ? "bg-purple-50 text-purple-700 border-purple-200"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                    }`}>
                      {vendor.status}
                    </span>
                  </div>

                  {/* 5 Features Display: Address, Contact Person, Phone, Email, Payment Terms */}
                  <div className="space-y-2 pt-2 border-t border-gray-100 text-xs">
                    {/* 1. Address & City */}
                    <div className="flex items-start gap-2 text-gray-600">
                      <MapPin className="w-3.5 h-3.5 text-[#FF6600] shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{vendor.address || "Plot 88, Bio-Fuel Complex"}, {vendor.city || "Faisalabad"}</span>
                    </div>

                    {/* 2. Contact Person */}
                    <div className="flex items-center gap-2 text-gray-700 font-semibold">
                      <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>{vendor.contactPerson}</span>
                    </div>

                    {/* 3. Phone */}
                    <div className="flex items-center gap-2 text-gray-700 font-mono text-[11px]">
                      <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{vendor.phone}</span>
                    </div>

                    {/* 4. Email */}
                    <div className="flex items-center gap-2 text-gray-500 text-[11px]">
                      <Mail className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span className="truncate">{vendor.email}</span>
                    </div>

                    {/* 5. Terms & Lead Time */}
                    <div className="flex items-center justify-between pt-1 text-[11px] font-medium text-gray-500">
                      <span>Terms: <strong className="text-gray-800">{vendor.paymentTerms}</strong></span>
                      <span>Lead: <strong className="text-gray-800">{vendor.leadTimeDays} Days</strong></span>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{vendor.rating.toFixed(1)} / 5.0</span>
                  </div>

                  <button
                    onClick={() => setInspectedVendor(vendor)}
                    className="flex items-center gap-1 text-xs font-bold text-[#FF6600] hover:underline"
                  >
                    <span>Vendor Profile</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: CREATE PURCHASE ORDER (WITH AUTOMATIC STOCK POPULATION) */}
      {isPoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-gray-100 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-extrabold text-base text-gray-900">
                  Create Purchase Order
                </h3>
                <p className="text-xs text-gray-500">
                  Selecting a registered stock item automatically populates its name, category, unit, and standard rate.
                </p>
              </div>
              <button
                onClick={() => setIsPoModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePO} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Contracted Supplier</label>
                  <select
                    value={poSupplierId}
                    onChange={(e) => setPoSupplierId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                  >
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Delivery Destination Boiler</label>
                  <select
                    value={poBoilerId}
                    onChange={(e) => setPoBoilerId(e.target.value)}
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
                  <label className="block text-xs font-bold text-gray-700 mb-1">Payment Terms</label>
                  <select
                    value={poTerms}
                    onChange={(e) => setPoTerms(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                  >
                    <option value="Net 30 Days">Net 30 Days</option>
                    <option value="Net 15 Days">Net 15 Days</option>
                    <option value="Cash On Delivery">Cash On Delivery</option>
                    <option value="Immediate Float">Immediate Float</option>
                  </select>
                </div>
              </div>

              {/* LINE ITEMS WITH AUTO POPULATION */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">
                    Order Items (Auto-Filled from Inventory)
                  </span>
                  <button
                    type="button"
                    onClick={handleAddLineItem}
                    className="flex items-center gap-1 text-xs font-bold text-[#FF6600] hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {poItems.map((item, idx) => {
                    const currentStock = inventory.find((i) => i.id === item.stockItemId);
                    return (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl border border-gray-200 bg-[#FAFBFD] space-y-2.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          {/* Registered Stock Item Selector */}
                          <div className="flex-1">
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">
                              Pick Registered Stock Item (Auto-Fills Details)
                            </label>
                            <select
                              value={item.stockItemId || ""}
                              onChange={(e) => handleSelectStockItemForLine(idx, e.target.value)}
                              className="w-full px-2.5 py-1.5 text-xs font-semibold border border-orange-200 bg-white rounded-lg focus:outline-none focus:border-[#FF6600]"
                            >
                              <option value="">-- Choose Stock Item --</option>
                              {inventory.map((inv) => (
                                <option key={inv.id} value={inv.id}>
                                  {inv.name} ({inv.category} · {inv.unit} · Rs. {inv.unitCost.toLocaleString("en-PK")})
                                </option>
                              ))}
                            </select>
                          </div>

                          {currentStock && (
                            <div className="shrink-0 text-right">
                              <span className="text-[10px] text-gray-400 block">Warehouse Stock:</span>
                              <span className="font-mono text-xs font-bold text-emerald-600">
                                {currentStock.quantity} {currentStock.unit}
                              </span>
                            </div>
                          )}

                          {poItems.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveLineItem(idx)}
                              className="p-1 text-gray-400 hover:text-rose-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        {/* Line Values */}
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                          <div className="sm:col-span-2">
                            <label className="block text-[10px] text-gray-500 font-bold mb-0.5">
                              Description
                            </label>
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) => {
                                const up = [...poItems];
                                const currentLine = up[idx];
                                if (currentLine) {
                                  currentLine.description = e.target.value;
                                  setPoItems(up);
                                }
                              }}
                              className="w-full px-2.5 py-1 text-xs border border-gray-200 rounded-lg bg-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-gray-500 font-bold mb-0.5">
                              Qty & Unit ({item.uom})
                            </label>
                            <input
                              type="number"
                              step="0.1"
                              value={item.qty}
                              onChange={(e) => {
                                const up = [...poItems];
                                const currentLine = up[idx];
                                if (currentLine) {
                                  currentLine.qty = e.target.value;
                                  setPoItems(up);
                                }
                              }}
                              className="w-full px-2.5 py-1 text-xs font-mono font-bold border border-gray-200 rounded-lg bg-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-gray-500 font-bold mb-0.5">
                              Unit Cost (PKR)
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              value={item.unitPrice}
                              onChange={(e) => {
                                const up = [...poItems];
                                const currentLine = up[idx];
                                if (currentLine) {
                                  currentLine.unitPrice = e.target.value;
                                  setPoItems(up);
                                }
                              }}
                              className="w-full px-2.5 py-1 text-xs font-mono font-bold border border-gray-200 rounded-lg bg-white"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsPoModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#FF6600] hover:bg-[#E65C00] rounded-xl shadow-sm transition-all"
                >
                  Confirm Purchase Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW VENDOR (5+ FEATURES) */}
      {isVendorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-extrabold text-base text-gray-900">
                  Register New Vendor / Supplier
                </h3>
                <p className="text-xs text-gray-500">
                  Record full commercial profile: Company name, physical address, contact person, phone & terms.
                </p>
              </div>
              <button
                onClick={() => setIsVendorModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateVendor} className="space-y-3.5 mt-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Company / Vendor Name</label>
                <input
                  type="text"
                  placeholder="e.g. Faisalabad Agro Energy Solutions"
                  value={vName}
                  onChange={(e) => setVName(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                />
              </div>

              {/* Address & City */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Physical Address</label>
                  <input
                    type="text"
                    placeholder="e.g. Plot 45, Small Industrial Estate"
                    value={vAddress}
                    onChange={(e) => setVAddress(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    placeholder="e.g. Faisalabad"
                    value={vCity}
                    onChange={(e) => setVCity(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                  />
                </div>
              </div>

              {/* Contact Person Name & Phone */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Contact Person Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Malik Tariq (Manager)"
                    value={vContactPerson}
                    onChange={(e) => setVContactPerson(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+92 300 1234567"
                    value={vPhone}
                    onChange={(e) => setVPhone(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs font-mono border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                  />
                </div>
              </div>

              {/* Email & Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="orders@vendor.pk"
                    value={vEmail}
                    onChange={(e) => setVEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Category Specialization</label>
                  <select
                    value={vCategory}
                    onChange={(e) => setVCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6600]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Terms & Lead Time */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Payment Terms</label>
                  <select
                    value={vTerms}
                    onChange={(e) => setVTerms(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg"
                  >
                    <option value="Net 30 Days">Net 30 Days</option>
                    <option value="Net 15 Days">Net 15 Days</option>
                    <option value="Cash On Delivery">Cash On Delivery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Lead Time (Days)</label>
                  <input
                    type="number"
                    value={vLeadDays}
                    onChange={(e) => setVLeadDays(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs font-mono border border-gray-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Status</label>
                  <select
                    value={vStatus}
                    onChange={(e) => setVStatus(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg"
                  >
                    <option value="Approved">Approved</option>
                    <option value="Preferred">Preferred</option>
                    <option value="Audited">Audited</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsVendorModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#FF6600] hover:bg-[#E65C00] rounded-xl shadow-sm transition-all"
                >
                  Register Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VENDOR PROFILE INSPECTION DRAWER */}
      {inspectedVendor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-orange-100 text-[#FF6600]">
                  {inspectedVendor.code}
                </span>
                <h3 className="font-extrabold text-lg text-gray-900 mt-1">{inspectedVendor.name}</h3>
                <span className="text-xs text-gray-500">{inspectedVendor.category}</span>
              </div>
              <button
                onClick={() => setInspectedVendor(null)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#FAFBFD] border border-gray-200 space-y-2">
                <div className="flex items-start gap-2 text-gray-700">
                  <MapPin className="w-4 h-4 text-[#FF6600] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Physical Facility:</span>{" "}
                    {inspectedVendor.address || "Main Industrial Highway"}, {inspectedVendor.city || "Punjab"}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-700">
                  <User className="w-4 h-4 text-gray-400 shrink-0" />
                  <div>
                    <span className="font-bold">Point of Contact:</span> {inspectedVendor.contactPerson}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-700 font-mono">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold">Direct Phone:</span> {inspectedVendor.phone}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-700">
                  <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                  <div>
                    <span className="font-bold">Commercial Email:</span> {inspectedVendor.email}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-orange-50/50 border border-orange-100">
                <div>
                  <span className="text-[10px] text-gray-500 font-bold block">Terms</span>
                  <span className="font-bold text-gray-900">{inspectedVendor.paymentTerms}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 font-bold block">Lead Time</span>
                  <span className="font-bold text-gray-900">{inspectedVendor.leadTimeDays} Days</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 font-bold block">Rating</span>
                  <span className="font-bold text-amber-600">{inspectedVendor.rating.toFixed(1)} / 5.0</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-gray-100">
              <button
                onClick={() => setInspectedVendor(null)}
                className="px-4 py-2 text-xs font-bold text-white bg-[#FF6600] rounded-xl hover:bg-[#E65C00]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
